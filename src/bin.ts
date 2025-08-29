#!/usr/bin/env node

import { Command } from "commander";

const program = new Command()
  .name("copilot-auto")
  .description("Make AWS Copilot deployments easier with intelligent configuration management")
  .version("1.0.0");

program.parse();
