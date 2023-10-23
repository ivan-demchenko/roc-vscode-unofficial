# Roc language VSCode extension (unofficial)

The unofficial VSCode extension for the [Roc language](https://roc-lang.org/).

## Features

- Syntax highlighting
- Language server integration

### Configuring language server

First, acquire a language server binary. The instructions for how to do so can
be found in [this README](https://github.com/ayazhafiz/roc/blob/lang-srv/crates/lang_srv/README.md).

Update your VSCode `settings.json` to point to the language server binary
location:

```
{
    "roc-lang.language-server.exe": "<path to language server binary>",
    // If you'd like to format Roc files on save
    "editor.formatOnSave": true
}
```

## Release Notes

### 0.0.10

- Various improvements to syntax highlighting and extension metadata.

## Contributors

Big kudos to early contributors:

- [Hannes](https://github.com/Hasnep)
- [Richard Feldman](https://github.com/rtfeldman)
- [ayazhafiz](https://github.com/ayazhafiz)
