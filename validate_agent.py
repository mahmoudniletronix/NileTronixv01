#!/usr/bin/env python3
"""Static non-executing lint of agent bundle; uses stdlib only."""
import json, re, sys, zipfile
from pathlib import Path

P=Path(__file__).resolve().parent
R=P/'.agents'
errors=[]
expect={'skills':16,'rules':8,'agents':3}
for kind,num in expect.items():
    files=sorted((R/kind).glob('*/SKILL.md' if kind=='skills' else '*.md'))
    if len(files)!=num: errors.append(f'{kind}: expected {num} files, found {len(files)}')
    for f in files:
        data=f.read_text(encoding='utf-8')
        if not data.startswith('---\n') or '\n---\n' not in data[4:]:
            errors.append(f'{f}: missing YAML frontmatter'); continue
        header=data.split('\n---\n',1)[0][4:]
        meta={k.strip():v.strip().strip('"') for k,v in re.findall(r'^([\w-]+):\s*(.*)$', header,re.M)}
        if kind in ('skills','agents'):
            if not meta.get('name') or not meta.get('description'):
                errors.append(f'{f}: required name/description absent')
            if meta.get('name') != (f.parent.name if kind=='skills' else f.stem):
                errors.append(f'{f}: name mismatches path')
        if kind=='rules' and (meta.get('trigger') not in {'model_decision','always_on','manual','glob'} or not meta.get('description')):
            errors.append(f'{f}: invalid trigger / missing description')
        if kind=='agents' and meta.get('subagent')!='true':
            errors.append(f'{f}: missing subagent true')
        for target in re.findall(r'`(\.\./\.\./(?:templates|knowledge|integrations)/[^`\n]+)`',data):
            q=(f.parent/target).resolve()
            if not q.is_file(): errors.append(f'{f}: missing relative ref {target}')
if not (R/'AGENTS.md').is_file():errors.append('missing .agents/AGENTS.md')
for f in (R/'integrations').glob('*.json'):
    try:
        d=json.loads(f.read_text(encoding='utf8'))
        if not isinstance(d.get('mcpServers'),dict): errors.append(f'{f}: no mcpServers')
    except Exception as e: errors.append(f'{f}: invalid JSON: {e}')
for expected_path in [P/'README.md',P/'INSTALL.md',P/'PROMPTS.md',P/'SOURCES.md',R/'knowledge/PROJECT_PROFILE.template.md']:
    if not expected_path.exists():errors.append(f'missing {expected_path}')
print('AGENT VALIDATION')
print('Skills:',len(list((R/'skills').glob('*/SKILL.md'))))
print('Rules:',len(list((R/'rules').glob('*.md'))))
print('Subagents:',len(list((R/'agents').glob('*.md'))))
print('Other agent files:',len(list(R.rglob('*')))-len(list((R/'skills').glob('*/SKILL.md')))-len(list((R/'rules').glob('*.md')))-len(list((R/'agents').glob('*.md'))))
if errors:
    for x in errors:print('FAIL:',x)
    sys.exit(1)
print('PASS: manifest structure, metadata, relative references and example MCP JSON')
print('Not tested: Antigravity runtime discovery or external tool connections.')
