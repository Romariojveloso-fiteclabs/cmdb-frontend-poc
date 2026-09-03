# Editorial standard and guide and report catalog

**English** | [Português (Brasil)](./CMDB-Reports-Guide-pt-BR.md)

This document is the entry point for Caatinga Malware DB (CMDB) technical documentation. The `docs/guides` directory contains supporting procedures organized by subject, while `docs/reports` contains academic reports. New reports must start from the [simplified Markdown template](../templates/malware-analysis-report/CMDB-Report-template-EN.md), adapted from the FIRST Malware Analysis SIG *Cyber Malware Analysis Report Template v1*.

## Current catalog

| Study | Português | English |
|---|---|---|
| Petya | [Original bilingual document](../reports/petya/CMDB-Petya-Report.md) | [Original bilingual document](../reports/petya/CMDB-Petya-Report.md) |
| Thanos | [Original bilingual document](../reports/thanos/CMDB-Thanos-Report.md) | [Original bilingual document](../reports/thanos/CMDB-Thanos-Report.md) |
| Alcatraz Locker (`CMDB-TR-003`, draft) | [Relatório](../reports/alcatraz/CMDB-TR-003-Alcatraz-Report-pt-BR.md) | [Report](../reports/alcatraz/CMDB-TR-003-Alcatraz-Report-EN.md) |
| Cerber (`CMDB-TR-004`, draft) | [Relatório](../reports/cerber/CMDB-TR-004-Cerber-Report-pt-BR.md) | [Report](../reports/cerber/CMDB-TR-004-Cerber-Report-EN.md) |
| Akira (`CMDB-TR-006`, draft) | [Relatório](../reports/akira/CMDB-TR-006-Akira-Report-pt-BR.md) | [Report](../reports/akira/CMDB-TR-006-Akira-Report-EN.md) |

## Available guides

| Purpose | Português | English |
|---|---|---|
| Create and preserve synthetic reference data (`CMDB-GD-001`) | [Guia](./synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md) | [Guide](./synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md) |
| Validate recovery with SHA-256 (`CMDB-GD-002`) | [Guia](./sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-pt-BR.md) | [Guide](./sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md) |
| Temporarily configure Windows 7 security controls in a laboratory (`CMDB-GD-003`) | [Guia](./windows-7-security-controls/CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-pt-BR.md) | [Guide](./windows-7-security-controls/CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-EN.md) |
| Create and validate ISO data media (`CMDB-GD-004`) | [Guia](./iso-media/CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md) | [Guide](./iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md) |

Each subject has its own directory. New images or attachments must remain inside the corresponding guide directory.

## Goals

- provide clear reading directly on GitHub and in Markdown readers;
- preserve authorship, contribution, review, and version history;
- separate observations, method, results, and defensive recommendations;
- maintain editorial parity between Brazilian Portuguese and English;
- present numbered figures with captions, alternative text, and sources; and
- use an academic structure informed by current ABNT and UFPE guidance.

The model is an **academic technical report**, not a thesis, dissertation, or final paper ready for institutional deposit. Final compliance must be reviewed by the appropriate library or academic authority.

## Required structure

Each report must contain: institutional identification, authorship, document control, citation, version history, sign-off, and a table of contents; abstract; legal disclaimer; presentation of the analyzed malware; activities performed and sample identification; laboratory environment; dynamic-analysis evidence organized into acquisition, execution, response, and recovery; conclusion; and references.

Do not add “course/class” or “classification” fields to editorial control. Technical statements about a malware family or variant belong in the report body and must be supported by evidence.

## Authorship and versions

Use a permanent, readable identifier in the form `CMDB-TR-NNN`. For every author, record the publication name, confirmed affiliation, optional ORCID, authorized institutional email, contributions, and relationship to the evidence.

Do not infer institutional affiliation from Git history alone. Authors, reviewers, and approvers must validate their data and sign the publication version. Each material editorial change must add a version entry with date, responsible party, and description.

When editorial validation is used, record the person's name, role, date, and validated version.

## Evidence and figures

- Number figures in presentation order, independently of filenames.
- Place the identifier and title above the image and the source below it.
- Provide meaningful alternative text.
- Remove credentials, personal information, victim identifiers, and secrets.
- Do not turn captions into instructions for executing malware.
- State whether a figure is reproduced, adapted, or produced by the authors.

## Languages and authoring format

Every document must provide complete `pt-BR` and `en` Markdown files. Apply technical and editorial changes to both versions in the same pull request. Markdown is the sole official editorial source and is readable directly on GitHub. Versioned reports must remain in Markdown.

For every sample, record its acquisition source, direct record link or identifier, access date, and independent validation sources. Distinguish sample repositories from defensive or recovery resources.

Every ZIP file added to the project must be effectively encrypted with the conventional password `infected`. The `.zip` extension and known password are not access controls; they only reduce accidental opening and execution. Contributors must verify protection before submitting the file.

Every new report must record the SHA-256 of the final package and of every extracted artifact. This record is required to identify the exact analyzed object, detect changes, and compare the sample with independent sources. Calculate the hash for the file actually analyzed, in an authorized environment, before any execution. On GNU/Linux-compatible systems, use `sha256sum path/to/file`; in PowerShell, use `Get-FileHash -Algorithm SHA256 path\to\file`. Do not infer a hash from a filename or unverified information.

Describe the analysis as a record of what was observed in the laboratory, preferably in the past tense and without imperative language. Do not turn the report into step-by-step instructions for activating malware, disabling security controls, or bypassing detection. When a command is essential to document a defensive or recovery measure, explain its purpose, limit it to the authorized environment, and cite the tool's original documentation.

[VirusTotal](https://www.virustotal.com/) should normally be recorded as an analysis or validation source. Link directly to the file report and record the analysis date. Do not describe VirusTotal as the acquisition source unless the analyzed artifact was actually obtained from an authorized VirusTotal service.

## Standards and reuse

The model considers ABNT NBR 14724:2024, NBR 6023:2025, NBR 10520:2023, NBR 6028:2021, NBR 6024:2012, and NBR 6027:2012, following UFPE's 2025 formatting material. Consult the [SIB/UFPE normalization page](https://agencia.ufpe.br/sib/ficha-catalografica-normalizacao) and the [CTG Library](https://www.ufpe.br/ctg/biblioteca) before final institutional publication.

To create a report, create `docs/reports/<study>`, reserve an unused `CMDB-TR-NNN` identifier, copy the templates as `CMDB-<study>-Report-EN.md` and `CMDB-<study>-Report-pt-BR.md`, adjust the language links at the top, add an `img` directory, register sources without inference, add the report to this catalog, and request technical, editorial, and institutional review.

Repository security, contribution, and licensing rules remain applicable to the report and its associated artifacts.
