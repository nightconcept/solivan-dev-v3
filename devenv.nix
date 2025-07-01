{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };
  languages.python = {
    enable = true;
    package = pkgs.python312;
  };
}
