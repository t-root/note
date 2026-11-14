```bash
git clone --filter=blob:none --no-checkout https://github.com/t-root/note.git
cd note
git sparse-checkout init --cone
git sparse-checkout set icons .github
git checkout main
```
