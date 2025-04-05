{
  pkgs,
  lib,
  config,
  inputs,
  ...
}: {
  languages.deno.enable = true;
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm = {
      enable = true;
      install.enable = true;
    };
  };
}
