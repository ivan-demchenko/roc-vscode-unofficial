# Roc language VSCode extension (unofficial)

The unofficial VSCode extension for the [Roc language](https://roc-lang.org/).

## Features

- Syntax highlighting
- With the language server:
    - Shows errors/warnings inline
    - Hover to view type
    - Go-to-definition (not for builtins)
    - Format on save

### Configuring language server

The `roc_lang_server` binary is included with [the roc nightly](https://github.com/roc-lang/roc/releases). You can also [build it from source](https://github.com/roc-lang/roc/blob/main/crates/lang_srv/README.md#building-from-source) if you need to.

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
