# To add new content...    2017-09-10

- Export latest from production firebase
- Manually copy to edutvum-exam-import.json when needed
```sh
reset && npm run export
```

- Run 'Format Document' in VS Code
- Then press 'ctrl+k+0' to collapse all

- Make  changes to edutvum-exam-import.json
- Run verify to check and fix errors
```sh
reset && npm run verify
```

- If there are TFQ errors, search replace
```sh
"choices"\:\s\[\n\s+"True",\n\s+"False"\n\s+\],\n
```

- Import it in staging and test.
- Then import into production.

- Save the last export and the import file as backup

