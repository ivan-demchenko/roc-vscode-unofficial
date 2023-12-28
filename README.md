# Roc language VSCode extension (unofficial)

The unofficial VSCode extension for the [Roc language](https://roc-lang.org/). Download it from:

- [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=IvanDemchenko.roc-lang-unofficial)
- [Open VSX Registry](https://open-vsx.org/extension/IvanDemchenko/roc-lang-unofficial)

## Features

- Syntax highlighting
- Language server integration

### Configuring language server

First, acquire a language server binary. The instructions for how to do so can
be found in [this README](https://github.com/ayazhafiz/roc/blob/lang-srv/crates/lang_srv/README.md).

Update your VSCode `settings.json` to point to the language server binary location:

```json
{
  "roc-lang.language-server.exe": "<path to language server binary>",
  // If you'd like to format Roc files on save
  "editor.formatOnSave": true
}
```

## Release Notes

### 0.1.0

- Language server integration

## Contributors

Big kudos to early contributors:

- [Hannes](https://github.com/Hasnep)
- [Richard Feldman](https://github.com/rtfeldman)
- [ayazhafiz](https://github.com/ayazhafiz)
