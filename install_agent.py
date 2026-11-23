#!/usr/bin/env python3
"""Universal Agent installer. Dry-run by default. No network or dependency installs."""
import argparse, datetime, os, shutil, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SOURCE = HERE / '.agents'


def target_root(scope, target):
    if scope == 'global':
        return Path.home() / '.gemini' / 'config'
    return Path(target).expanduser().resolve() / '.agents'


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scope', choices=['global','workspace'], required=True)
    parser.add_argument('--target', default='.', help='Workspace root for --scope workspace')
    parser.add_argument('--apply', action='store_true', help='Actually install; otherwise dry-run')
    parser.add_argument('--replace-workspace', action='store_true', help='Explicitly replace existing workspace .agents after backup')
    args=parser.parse_args()
    if not (SOURCE/'AGENTS.md').exists():
        parser.error('Missing bundled .agents/AGENTS.md')
    if args.replace_workspace and args.scope != 'workspace':
        parser.error('--replace-workspace only applies to workspace installs')
    dst=target_root(args.scope,args.target)
    if args.scope=='workspace' and not dst.parent.is_dir():
        parser.error(f'Workspace does not exist: {dst.parent}')
    # Keep backup outside active discovery directories, in sibling target location.
    stamp=datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
    backup_parent = (dst.parent / 'agent-backups') if args.scope=='workspace' else (dst.parent / 'agent-config-backups')
    files=sorted(x for x in SOURCE.rglob('*') if x.is_file())
    if len(files)<20:
        parser.error('Source package looks incomplete')
    print('MODE:', 'APPLY' if args.apply else 'DRY RUN', '| SCOPE:',args.scope)
    print('SOURCE:',SOURCE)
    print('DESTINATION:',dst)
    print('FILES:',len(files))
    if args.scope=='workspace' and dst.exists() and not args.replace_workspace:
        print('WARNING: Existing workspace .agents will be merged, leaving legacy files in place.')
        print('Use --replace-workspace --apply to make a backed-up clean replacement.')
    if args.scope=='global':
        print('NOTE: Global install preserves unrelated legacy global files; review conflicts manually.')
    if not args.apply:
        print('NO CHANGES MADE. Add --apply after reviewing this output.')
        return 0
    backup_parent.mkdir(parents=True, exist_ok=True)
    if args.scope=='workspace' and args.replace_workspace and dst.exists():
        backup=backup_parent / f'workspace-agents-{stamp}'
        if backup.exists():
            parser.error(f'Backup collision: {backup}')
        shutil.copytree(dst,backup)
        print('BACKUP:',backup)
        shutil.rmtree(dst)
    elif dst.exists():
        existing=[dst/p.relative_to(SOURCE) for p in files if (dst/p.relative_to(SOURCE)).is_file()]
        if existing:
            backup=backup_parent / f'overwritten-agent-files-{stamp}'
            if backup.exists():
                parser.error(f'Backup collision: {backup}')
            for old in existing:
                b=backup/old.relative_to(dst)
                b.parent.mkdir(parents=True,exist_ok=True)
                shutil.copy2(old,b)
            print('BACKUP of replaced files:',backup)
    for source_file in files:
        dest_file=dst/source_file.relative_to(SOURCE)
        dest_file.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(source_file,dest_file)
    print('INSTALLED',len(files),'files to',dst)
    print('NEXT: Inspect Customizations and remove or disable conflicting old global/workspace instructions manually.')
    return 0

if __name__=='__main__':
    sys.exit(main())
