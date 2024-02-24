{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    roc = {
      url = "github:roc-lang/roc";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
  outputs = {
    nixpkgs,
    roc,
    ...
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
  in {
    formatter = nixpkgs.lib.genAttrs systems (
      system: let
        pkgs = import nixpkgs {inherit system;};
      in
        pkgs.nixpkgs-fmt
    );
    devShells = nixpkgs.lib.genAttrs systems (system: let
      pkgs = import nixpkgs {inherit system;};
      rocPkgs = roc.packages.${system};
      node = pkgs.nodejs_20;
      corepackEnable = pkgs.runCommand "corepack-enable" {} ''
        mkdir -p $out/bin
        ${node}/bin/corepack enable --install-directory $out/bin
      '';
    in {
      default = pkgs.mkShell {
        buildInputs = [
          corepackEnable
          node
          # NOTE: this includes the cli as well as the language server
          # we could switch it if we wanted to be slightly smaller on the dep
          (with rocPkgs; [full])
        ];
        shellHook = ''
          export ROC_LSP_PATH=${rocPkgs.full}/bin/roc_language_server
        '';
      };
    });
  };
}
