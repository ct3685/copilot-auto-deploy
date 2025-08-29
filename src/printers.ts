export const C = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  PURPLE: '\x1b[0;35m',
  CYAN: '\x1b[0;36m',
  WHITE: '\x1b[1;37m',
  NC: '\x1b[0m',
  BOLD: '\x1b[1m'
} as const;

export function header(text: string): void {
  console.log(`\n${C.PURPLE}${C.BOLD}╔═══════════════════════════════════════════════════════════════╗${C.NC}`);
  console.log(`${C.PURPLE}${C.BOLD}║${C.NC} ${C.WHITE}${C.BOLD}${text}${C.NC} ${C.PURPLE}${C.BOLD}║${C.NC}`);
  console.log(`${C.PURPLE}${C.BOLD}╚═══════════════════════════════════════════════════════════════╝${C.NC}\n`);
}

export function phase(number: string, title: string): void {
  console.log(`\n${C.CYAN}${C.BOLD}▶ PHASE ${number}: ${title}${C.NC}`);
  console.log(`${C.CYAN}${C.BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${C.NC}`);
}

export function step(message: string): void {
  console.log(`${C.WHITE}${C.BOLD}→ ${message}${C.NC}`);
}

export function success(message: string): void {
  console.log(`${C.GREEN}✅ ${message}${C.NC}`);
}

export function error(message: string): void {
  console.log(`${C.RED}❌ ${message}${C.NC}`);
}

export function warn(message: string): void {
  console.log(`${C.YELLOW}⚠️  ${message}${C.NC}`);
}

export function info(message: string): void {
  console.log(`${C.BLUE}ℹ️  ${message}${C.NC}`);
}

export function deploymentSuccess(service: string, url?: string): void {
  console.log(`\n${C.GREEN}${C.BOLD}╔═══════════════════════════════════════════════════════════════╗${C.NC}`);
  console.log(`${C.WHITE}${C.BOLD}  🚀 SERVICE DEPLOYED SUCCESSFULLY${C.NC}`);
  console.log(`${C.CYAN}  Service:${C.NC} ${C.WHITE}${C.BOLD}${service}${C.NC}`);
  if (url) console.log(`${C.GREEN}  Health Check:${C.NC} ${C.CYAN}${url}${C.NC}`);
  console.log(`${C.GREEN}${C.BOLD}╚═══════════════════════════════════════════════════════════════╝${C.NC}\n`);
}
