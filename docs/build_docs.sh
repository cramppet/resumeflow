#! /bin/bash

command -v grip >/dev/null 2>&1 || { echo "I require grip but it's not installed.  Aborting." >&2; exit 1; }

`grip admin_manual.md --export compiled/admin_manual.html`
`grip system_manual.md --export compiled/system_manual.html`
`grip user_manual.md --export compiled/user_manual.html`
`grip todo.md --export compiled/todo.html`
