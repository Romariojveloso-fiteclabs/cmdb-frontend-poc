# CMDB Guide — validating file recovery with SHA-256

**English** | [Português (Brasil)](./CMDB-GD-002-SHA256-Recovery-Validation-Guide-pt-BR.md)

**Federal University of Pernambuco (UFPE)**  
**Center for Technology and Geosciences (CTG)**  
**Lato Sensu Graduate Program in Offensive Security and Cyber Intelligence**  
**Caatinga Malware DB (CMDB)**

## Document control

| Field | Value |
|---|---|
| Identifier | `CMDB-GD-002` |
| Version | `0.1.0` |
| Status | Draft |
| Date | 2026-09-01 |
| Language | English (`en`) |

## Authorship and contribution

**Author:** Romário J. O. Veloso  
**Affiliation:** Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife, Pernambuco, Brazil.  
**Contribution:** definition of the experimental validation workflow, systematization of result criteria, and initial drafting.  
**ORCID and institutional email:** not provided.

### Suggested citation

VELOSO, Romário J. O. *CMDB Guide — validating file recovery with SHA-256*. Recife: Federal University of Pernambuco, 2026. Version 0.1.0. Work in progress.

## Version history

| Version | Date | Responsible party | Change |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | First editorial version based on laboratory notes. |

## Contents

1. [Purpose, scope, and audience](#1-purpose-scope-and-audience)
2. [Safety notice](#2-safety-notice)
3. [Prerequisites](#3-prerequisites)
4. [Concepts and compared objects](#4-concepts-and-compared-objects)
5. [Recording the reference SHA-256](#5-recording-the-reference-sha-256)
6. [Validating the recovered file](#6-validating-the-recovered-file)
7. [Classification criteria](#7-classification-criteria)
8. [ZIP archives and structured formats](#8-zip-archives-and-structured-formats)
9. [Partial comparison and byte exposure](#9-partial-comparison-and-byte-exposure)
10. [Limitations](#10-limitations)
11. [Evidence record](#11-evidence-record)
12. [Troubleshooting](#12-troubleshooting)
13. [References](#13-references)
14. [Editorial validation](#14-editorial-validation)

## 1. Purpose, scope, and audience

This guide establishes a reproducible method for determining whether a recovered file matches a known reference file. SHA-256 provides a cryptographic digest of the content and can detect changes even when the name, extension, and apparent size remain the same.

The document is intended for students, researchers, and reviewers evaluating defensive or recovery-tool results in an authorized laboratory. It does not instruct readers to execute malware or claim compatibility with a specific family.

## 2. Safety notice

- Calculate the reference digest on a trusted system before any experiment.
- Wait for writes to finish and close applications that may modify the file.
- Do not treat a digest calculated only inside a compromised machine as definitive; the system may tamper with the file, tool, or output.
- Treat recovered and processed files as untrusted even when they have a common extension.
- Perform final validation in a clean, isolated, disposable environment according to the institutional transfer and quarantine procedure.
- Do not use writable folders shared with the compromised machine to return files to an everyday host.
- Do not open, preview, or extract untrusted content merely to calculate its digest.

Hash commands only read the specified files. Examples using `>` create or replace manifests; inspect the path and preserve earlier records.

## 3. Prerequisites

- an intact, preserved, and identified reference file;
- the recovered file to be evaluated;
- optionally, the processed or encrypted artifact for documentation;
- a trusted environment for final validation;
- exact object sizes and UTC timestamps;
- a SHA-256 implementation: GNU `sha256sum`, a compatible `certutil`, or PowerShell with `Get-FileHash` available;
- GNU `cmp`, optionally, for additional binary comparison; and
- `zip`, optionally, for structural checks of ZIP archives.

To create the known material, consult the [CMDB Guide to creating and preserving synthetic reference data](../synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md).

## 4. Concepts and compared objects

| Term | Definition |
|---|---|
| SHA-256 | A SHA-2-family function that produces a 256-bit digest, normally represented by 64 hexadecimal characters. |
| Integrity | The property evaluated when checking whether content remained unchanged relative to a reference. |
| Authenticity | Confirmation of origin or authorship. A digest alone does not provide it. |
| Byte-for-byte equality | Every byte has the same value and position in both objects. |
| Reference file | The known original preserved before the experiment. |
| Processed artifact | The result produced by the studied event, such as an encrypted or modified file. |
| Recovered file | The output provided by the recovery process or tool. |

Record separately, when present:

1. the SHA-256 of the package containing the analyzed sample;
2. the SHA-256 of each extracted artifact;
3. the SHA-256 of the reference file;
4. the SHA-256 of the processed artifact; and
5. the SHA-256 of the recovered file.

These values identify different objects and must not be used interchangeably.

## 5. Recording the reference SHA-256

### 5.1 GNU/Linux

In the directory containing the stable file:

```bash
stat --format='%n	%s bytes' -- reference-file.bin
sha256sum -- reference-file.bin
```

To create and check a manifest:

```bash
sha256sum -- reference-file.bin > reference-file.bin.sha256
sha256sum --check --strict -- reference-file.bin.sha256
```

The `>` operator replaces a file with the same name. Use a new directory or confirm that the previous manifest has already been preserved.

The manifest contains the filename. Run the check in the corresponding directory and keep the file and manifest associated but outside the compromised environment's reach.

### 5.2 Windows 7 with `certutil`

On a legacy Windows 7 guest, first inspect the parameters provided by the local installation:

```cmd
certutil -?
```

When `-hashfile` and SHA-256 are available:

```cmd
certutil -hashfile "C:\CMDB\reference-file.bin" SHA256
```

Record the complete output, system version, and command used. `certutil` versions may provide different parameters. A result produced inside a guest that is later compromised is supporting evidence only and must be confirmed on a trusted system.

### 5.3 PowerShell when `Get-FileHash` is available

Older PowerShell installations found on Windows 7 may not provide `Get-FileHash`. Confirm availability before using it:

```powershell
Get-Command Get-FileHash -ErrorAction Stop
Get-FileHash -LiteralPath 'C:\CMDB\reference-file.bin' -Algorithm SHA256
```

Do not install or update components in the middle of an experiment merely to obtain this cmdlet; use the method previously validated by the laboratory.

### 5.4 Preserving the record

Copy the manifest to protected storage or the institutional evidence system before the experiment. Keeping a file and a modifiable digest in the same location detects accidental changes but does not prove authenticity: both can be replaced.

When origin and chain of custody must be demonstrated, associate the manifest with a digital signature, immutable record, or another institutionally approved control.

## 6. Validating the recovered file

### 6.1 Record the three states

Calculate and record the values in a trusted environment without altering the files:

```bash
sha256sum -- reference-file.bin
sha256sum -- processed-artifact.bin
sha256sum -- recovered-file.bin
```

An artifact that was actually modified is expected to have a digest different from the original. The difference does not, however, identify the algorithm, variant, or cause of the change. Merely appending an extension without changing the bytes is also insufficient evidence of encryption.

### 6.2 Interpret the digests

- **Reference SHA-256 equal to recovered SHA-256:** strong practical evidence of content identity, provided the files are stable and calculation occurs in a trusted environment.
- **Reference SHA-256 different from recovered SHA-256:** the objects are not byte-for-byte identical.
- **SHA-256 unavailable or calculated only on a compromised system:** inconclusive until trusted verification.

A “success” message displayed by a tool does not replace this validation.

### 6.3 Additional binary comparison on GNU/Linux

When both files can remain in the same trusted environment:

```bash
cmp -s -- reference-file.bin recovered-file.bin
cmp_status=$?

case "$cmp_status" in
  0) echo "Files are byte-for-byte identical" ;;
  1) echo "Files differ" ;;
  *) echo "Comparison error" ;;
esac
```

Code `0` means equality, `1` means a difference, and `2` means an error. Do not interpret a read error or incorrect path as a valid difference.

### 6.4 Comparison in PowerShell

When `Get-FileHash` is available in a trusted environment:

```powershell
$referenceHash = (Get-FileHash -LiteralPath 'C:\CMDB\reference-file.bin' -Algorithm SHA256 -ErrorAction Stop).Hash
$recoveredHash = (Get-FileHash -LiteralPath 'C:\CMDB\recovered-file.bin' -Algorithm SHA256 -ErrorAction Stop).Hash

if ([string]::Equals($referenceHash, $recoveredHash, [System.StringComparison]::OrdinalIgnoreCase)) {
    'Files are identical according to SHA-256'
} else {
    'Files differ according to SHA-256'
}
```

The script must fail explicitly if either file cannot be read. Preserve the output and do not treat empty values as valid digests.

## 7. Classification criteria

| Classification | Minimum criterion | Appropriate reporting language |
|---|---|---|
| Exact recovery | SHA-256 equals the known original when calculated in a trusted environment; optionally, `cmp` returns `0` | “The recovered file matches the reference file byte for byte.” |
| Partial or functional recovery | SHA-256 differs, but part of the content or structure was validated by a documented method | “Partial/functional recovery occurred; the object is not identical to the original.” |
| Recovery failure | Output is absent, unreadable, or fails the defined tests | “No usable recovery was confirmed under the applied criteria.” |
| Inconclusive | No trusted original, unverifiable digest, read error, or evidence limited to the tool interface | “The available evidence is insufficient to confirm recovery.” |

Equal size, a restored name, removal of an extension, or the apparent ability to open a file does not establish exact recovery.

## 8. ZIP archives and structured formats

When the reference object is a ZIP, equality of the ZIP's own SHA-256 establishes container identity. If its digest differs, the internal content may still be partially or logically equivalent, but the container was not recovered byte for byte.

A structural check can supplement the analysis:

```bash
zip -T recovered-file.zip
```

This command checks structure according to the selected tool; it does not establish content identity, completeness, or safety.

If internal entries must be extracted and compared, do so only in an isolated, disposable environment. Record the inventory, relative paths, sizes, and SHA-256 of each item. Executables, macro-enabled documents, and other recovered content remain untrusted.

## 9. Partial comparison and byte exposure

A complete SHA-256 answers whether two objects are identical; it does not reveal how many bytes were recovered, which regions changed, or the cause of the difference.

Avoid publishing extensive byte dumps or using unbounded detailed output. Tools such as `cmp -l` can produce enormous volumes and disclose file content. When offset analysis is essential:

- define the range and technical question in advance;
- use the smallest amount of data required;
- record offsets, range size, and tool;
- do not expose personal content, credentials, keys, or victim data; and
- distinguish equal bytes from semantically recovered content.

A percentage of available bytes, a percentage of reconstructed key material, or a progress bar does not automatically equal the percentage of recovered files.

## 10. Limitations

- Collisions are theoretically possible; in this guide, SHA-256 equality is treated as strong practical evidence, not absolute mathematical proof.
- A digest does not establish provenance, authorship, creation time, safety, or absence of malicious content.
- An unprotected manifest can be altered together with the file.
- A calculation performed on a compromised system can be falsified.
- A different digest does not measure the extent of damage or exclude useful partial recovery.
- An equal digest confirms equality with the reference, but it does not guarantee that the reference itself is legitimate or safe.
- Reconstructed files may be functionally equivalent while having different bytes or metadata.
- Successful opening in an application does not necessarily reveal truncation, silent corruption, or lost metadata.
- Checking very large files requires a complete read and may consume considerable time and input/output resources.

## 11. Evidence record

| Field | Record |
|---|---|
| Experiment identifier |  |
| Responsible party |  |
| Trusted verification environment |  |
| UTC date and time |  |
| Tool and version |  |
| Reference filename and size |  |
| Reference-file SHA-256 |  |
| Processed-artifact filename and size |  |
| Processed-artifact SHA-256 |  |
| Recovered filename and size |  |
| Recovered-file SHA-256 |  |
| `cmp` result, if used |  |
| Structural/functional validation, if used |  |
| Final classification |  |
| Limitations and anomalies |  |

Do not publish credentials, personal paths, victim content, or unnecessary byte-for-byte output.

## 12. Troubleshooting

### The manifest reports a missing file

The name is stored in the manifest and resolved from the current directory. Return to the correct directory or create a record for the new name without replacing the original digest.

### The digest changes between runs

Confirm that the file has finished being written, is not being modified by another application, and resolves to the same path. Preserve both results and investigate before proceeding.

### The file opens, but the digest is different

Classify it as non-identical. Perform separate structural and functional validation to determine whether partial recovery occurred, without using apparent opening as proof of completeness.

### The tool reports success, but validation fails

Record the message as an observation from the tool and retain a partial, failed, or inconclusive result according to the independent evidence.

### `Get-FileHash` is unavailable on Windows 7

Do not alter the laboratory during the test. Use a previously validated `certutil -hashfile` method or transfer the object through the controlled procedure to a clean environment with an available tool.

### `cmp` returns code `2`

This is an error, not a confirmed difference. Check paths, permissions, storage, and input/output errors.

## 13. References

- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Available at: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Accessed: 1 September 2026.
- FREE SOFTWARE FOUNDATION. *GNU Diffutils*. Available at: <https://www.gnu.org/software/diffutils/manual/diffutils.html>. Accessed: 1 September 2026.
- MICROSOFT. *Get-FileHash*. Available at: <https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/get-filehash?view=powershell-5.1>. Accessed: 1 September 2026.
- MICROSOFT. *certutil*. Available at: <https://learn.microsoft.com/windows-server/administration/windows-commands/certutil>. Accessed: 1 September 2026.
- NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. *Secure Hash Standard (SHS)*. FIPS PUB 180-4. Gaithersburg, 2015. Available at: <https://doi.org/10.6028/NIST.FIPS.180-4>. Accessed: 1 September 2026.
- CAATINGA MALWARE DB. [Report editorial standard and guide catalog](../CMDB-Reports-Guide-EN.md).

## 14. Editorial validation

| Role | Name | Status | Date/validated version |
|---|---|---|---|
| Author | Romário J. O. Veloso | Signature pending | — |
| Technical reviewer | To be assigned | Pending | — |
| Editorial approval | To be assigned | Pending | — |

Signatures must be recorded only after technical and editorial review of the version intended for publication.
