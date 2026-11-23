#!/usr/bin/env python3
"""Opt-in Antigravity MCP configuration helper. Dry-run by default. No network installs."""
from pathlib import Path
import argparse, datetime, json, shutil, sys

ROOT=Path(__file__).resolve().parent


def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--scope',choices=['global','workspace'],required=True)
    p.add_argument('--target',default='.',help='Project directory (workspace only)')
    p.add_argument('--tool',choices=['playwright','context7','both'],required=True)
    p.add_argument('--apply',action='store_true',help='Save config. Without this, preview only.')
    args=p.parse_args()
    dest=(Path.home()/'.gemini'/'config'/'mcp_config.json') if args.scope=='global' else Path(args.target).expanduser().resolve()/'.agents'/'mcp_config.json'
    if args.scope=='workspace' and not dest.parent.is_dir():
        p.error(f'Missing project agent directory: {dest.parent}. Install the agent first.')
    selected=['playwright','context7'] if args.tool=='both' else [args.tool]
    try:
        current=json.loads(dest.read_text(encoding='utf8')) if dest.exists() else {'mcpServers':{}}
        if not isinstance(current,dict) or not isinstance(current.get('mcpServers',{}),dict):
            p.error('Existing MCP config is not a mcpServers object; no changes made.')
        current.setdefault('mcpServers',{})
        for name in selected:
            sample=ROOT/'.agents'/'integrations'/f'{name}-mcp.example.json'
            conf=json.loads(sample.read_text(encoding='utf8'))
            if name in current['mcpServers']:
                print('WARNING: Existing MCP entry will be replaced:',name)
            current['mcpServers'][name]=conf['mcpServers'][name]
    except (ValueError,OSError,KeyError) as ex:
        p.error(f'Config unreadable: {ex}')
    print('MODE:', 'APPLY' if args.apply else 'DRY RUN','| DESTINATION:',dest)
    print('TOOLS:',', '.join(selected))
    print('Playwright uses npx; enabling its config may download third-party code on the first MCP launch.')
    print('Context7 is a remote MCP endpoint; review privacy/authentication requirements first.')
    if not args.apply:
        print('NO CHANGES MADE. Use --apply to opt in.')
        return 0
    if dest.exists():
        backup=dest.parent / ('mcp_config.backup-'+datetime.datetime.now().strftime('%Y%m%d-%H%M%S')+'.json')
        if backup.exists():p.error(f'Backup exists: {backup}')
        shutil.copy2(dest,backup)
        print('BACKUP:',backup)
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(current,indent=2)+'\n',encoding='utf8')
    print('Configured MCP entries. Reopen/refresh MCP manager. No server started by this script.')
    return 0

if __name__=='__main__':
    sys.exit(main())
