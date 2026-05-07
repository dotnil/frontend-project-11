{
  description = "playground-js";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/25.11";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_24
        ];
      };
    });
}
