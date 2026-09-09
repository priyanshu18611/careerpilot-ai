# Security Policy

## Supported Versions

CareerPilot AI is currently under active development.

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |
| < 1.0   | No        |

## Reporting a Vulnerability

If you discover a security vulnerability in CareerPilot AI, please report it privately.

Please do not create a public GitHub issue for security vulnerabilities.

When reporting a vulnerability, please include:

- A clear description of the issue
- Steps to reproduce the vulnerability
- Potential security impact
- Relevant screenshots or logs, if available
- Any suggested mitigation, if known

## Responsible Disclosure

Please allow reasonable time for the issue to be investigated and fixed before publicly disclosing security details.

Security reports will be reviewed and addressed as soon as reasonably possible.

## Security Practices

CareerPilot AI follows these practices:

- Secrets are stored through environment variables.
- Real API keys must never be committed to the repository.
- `.env` files are excluded from Git tracking.
- Resume uploads are limited by file type and size.
- Uploaded resume files are removed after analysis.
- Automated backend tests run through GitHub Actions.
- Dependencies should be regularly reviewed and updated.

## Disclaimer

CareerPilot AI is currently a portfolio/startup-style project under active development. Security controls may evolve as the platform moves toward production deployment.
