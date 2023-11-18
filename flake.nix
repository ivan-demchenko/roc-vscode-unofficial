{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    roc = {
      url = "github:roc-lang/roc";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, ... }@inputs:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        node = pkgs.nodejs_18;
        # NOTE: this includes the cli as well as the lang server
        # we could switch to .lang-server if we wanted to be slightly smaller on the dep
        roc-full = inputs.roc.packages.${system}.full;
      in {
        formatter = pkgs.nixpkgs-fmt;
        devShells = {
          default = pkgs.mkShell {
            buildInputs = [ node roc-full ];
            shellHook = ''
              export ROC_LSP_PATH=${roc-full}/bin/roc_ls
            '';
          };
        };
      });
}
