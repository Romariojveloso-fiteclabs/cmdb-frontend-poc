# CMDB Guide — creating and preserving synthetic reference data

**English** | [Português (Brasil)](./CMDB-GD-001-Synthetic-Reference-Data-Guide-pt-BR.md)

**Federal University of Pernambuco (UFPE)**  
**Center for Technology and Geosciences (CTG)**  
**Lato Sensu Graduate Program in Offensive Security and Cyber Intelligence**  
**Caatinga Malware DB (CMDB)**

## Document control

| Field | Value |
|---|---|
| Identifier | `CMDB-GD-001` |
| Version | `0.1.0` |
| Status | Draft |
| Date | 2026-09-01 |
| Language | English (`en`) |

## Authorship and contribution

**Author:** Romário J. O. Veloso  
**Affiliation:** Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife, Pernambuco, Brazil.  
**Contribution:** experimental procedure design, systematization of preservation practices, and initial drafting.  
**ORCID and institutional email:** not provided.

### Suggested citation

VELOSO, Romário J. O. *CMDB Guide — creating and preserving synthetic reference data*. Recife: Federal University of Pernambuco, 2026. Version 0.1.0. Work in progress.

## Version history

| Version | Date | Responsible party | Change |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | First editorial version based on laboratory notes. |

## Contents

1. [Purpose, scope, and audience](#1-purpose-scope-and-audience)
2. [Safety notice](#2-safety-notice)
3. [Prerequisites](#3-prerequisites)
4. [Terms](#4-terms)
5. [Planning the reference file](#5-planning-the-reference-file)
6. [GNU/Linux procedure](#6-gnulinux-procedure)
7. [Validation and acceptance criteria](#7-validation-and-acceptance-criteria)
8. [Limitations](#8-limitations)
9. [Evidence record](#9-evidence-record)
10. [Troubleshooting](#10-troubleshooting)
11. [References](#11-references)
12. [Editorial validation](#12-editorial-validation)

## 1. Purpose, scope, and audience

This guide describes how to create, identify, and preserve an **intact reference file**, also called a known original, for subsequently determining whether a recovery process restored the same content byte for byte.

The procedure is intended for students, researchers, and reviewers working in authorized academic laboratories. It covers synthetic-data creation, size and SHA-256 recording, and preservation of a trusted copy. ISO media creation is covered separately in the [CMDB Guide to creating and validating ISO data media](../iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md).

The guide does not teach readers how to obtain or execute malware, disable security controls, bypass detection, or operate a specific decryptor. Those activities require a separate protocol, institutional authorization, and appropriate supervision.

## 2. Safety notice

The commands in this document create only synthetic data and supporting files. When the reference file is used in a study involving malicious software:

- use dedicated, isolated, and formally authorized infrastructure;
- keep the preserved copy outside the analyzed virtual machine and outside every path shared with it;
- disable shared folders, clipboard integration, drag and drop, and USB device passthrough between host and guest;
- configure network connectivity according to the laboratory protocol without assuming that a virtual network is inherently safe;
- retain a pre-experiment snapshot without treating it as a backup replacement; and
- treat every artifact originating from the compromised machine as untrusted.

## 3. Prerequisites

- a trusted GNU/Linux host outside the compromised environment;
- a working directory that is not shared with the virtual machine;
- enough free space for the file, its copies, and snapshots;
- GNU Coreutils, including `dd`, `stat`, and `sha256sum`;
- GNU Findutils for inventorying the staging area; and
- `zip`, only when packaging is required.

Install dependencies only through the procedure approved for the host. This guide does not provide installation commands or download instructions.

Before creating large files, inspect the free space on the current volume:

```bash
df -h -- .
```

## 4. Terms

| Term | Definition |
|---|---|
| Reference file | An intact, known file used as the comparison baseline. It is not a malware sample. |
| Preserved copy | An instance retained on the trusted host without exposure to the compromised guest. |
| Working copy | A verified instance intended for the experimental environment. |
| SHA-256 manifest | A text file associating a SHA-256 digest with the verified object's name. |
| Host | The system running the virtualization platform. |
| Guest | The virtual machine used in the experiment. |

## 5. Planning the reference file

Choose the size and format according to the experimental question. A single large file does not represent behavior observed with small files, different formats, or other extensions. When relevant, use a synthetic set containing different sizes and formats, and record each item separately.

The main example in this guide creates 64 MiB, which is sufficient to validate the workflow without excessive resource consumption. A size of 4.5 GiB is presented only as an option for studies with a specific technical justification.

Data produced by `/dev/urandom` is difficult to compress, but each run generates different content. Recording the SHA-256 and preserving the original are therefore essential; the command cannot recreate the same file later.

An object larger than 4 GiB may require ZIP64 and compatible tools. A 4.5 GiB experiment may also consume several times that amount when the binary, ZIP archive, copies, and snapshots are considered.

## 6. GNU/Linux procedure

### 6.1 Prepare dedicated directories

Run these commands in a previously inspected location that is not exposed to the virtual machine:

```bash
mkdir -p -- cmdb-reference-lab/build
mkdir -p -- cmdb-reference-lab/preserved
mkdir -p -- cmdb-reference-lab/staging/data
cd -- cmdb-reference-lab/build
```

The `preserved` directory separates the experimental workflow, but a copy on the same disk is not an independent backup. Use additional protected storage when laboratory policy requires protection against failure or tampering.

### 6.2 Generate synthetic data

Recommended 64 MiB example:

```bash
dd if=/dev/urandom of=reference-file.bin bs=1M count=64 status=progress
```

Optional example of approximately 4.5 GiB:

```bash
dd if=/dev/urandom of=reference-file.bin bs=1M count=4608 status=progress
```

Use the second command only after justifying the size and checking storage, input/output time, and tool compatibility.

### 6.3 Record the size and SHA-256

```bash
stat --format='%n	%s bytes' -- reference-file.bin
sha256sum -- reference-file.bin > reference-file.bin.sha256
sha256sum --check --strict -- reference-file.bin.sha256
```

The `>` operator replaces a manifest with the same name. Work in a new directory or verify beforehand that no previous record will be lost.

Also record the UTC date and time, operating system, and tool versions. Calculate the digest only after the file has finished being written.

### 6.4 Package without compression when required

Packaging is optional. If the ZIP is the object actually submitted to the experiment, it becomes the reference object and requires its own record:

```bash
zip -0 reference-file.zip reference-file.bin
zip -T reference-file.zip
sha256sum -- reference-file.zip > reference-file.zip.sha256
sha256sum --check --strict -- reference-file.zip.sha256
```

The `-0` option stores the content without compression. The test performed by `zip -T` checks the ZIP structure, but it does not replace a SHA-256 comparison with the preserved object.

### 6.5 Preserve the known object

The following example assumes that the ZIP is the selected object. If the study uses the binary file directly, replace the names consistently.

```bash
cp -- reference-file.zip ../preserved/
cp -- reference-file.zip.sha256 ../preserved/
(cd ../preserved && sha256sum --check --strict -- reference-file.zip.sha256)
```

Do not rename the preserved copy without updating the record. A manifest generated by GNU `sha256sum` contains the filename and resolves it from the directory in which the check is run.

### 6.6 Create and verify the working copy

```bash
cp -- ../preserved/reference-file.zip ../staging/data/
cp -- ../preserved/reference-file.zip.sha256 ../staging/data/
(cd ../staging/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Only the working copy should be presented to the virtual machine. The preserved copy remains outside the guest's reach.


## 7. Validation and acceptance criteria

Preparation is complete only when:

- the reference object's exact size and SHA-256 have been recorded;
- the manifest validates the preserved copy;
- the manifest validates the working copy;
- the preserved copy remains outside paths shared with the guest;
- origin, date, tools, and responsible parties have been documented; and
- snapshot and isolation controls have been reviewed.

To transport the copy through virtual optical media, continue with the [CMDB Guide to creating and validating ISO data media](../iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md). After an experiment, validate the result according to the [CMDB Guide to validating file recovery with SHA-256](../sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md).

## 8. Limitations

- SHA-256 demonstrates consistency of the compared content but does not authenticate its origin by itself.
- A file and its manifest can be tampered with together; use protected storage or a digital signature when authenticity is required.
- Random data does not reproduce the internal structure of documents, databases, or media formats.
- A single size, format, or name cannot support general conclusions about encryption or recovery behavior.
- A recreated ZIP may contain logically equivalent content while having a different digest because of metadata or entry order.
- Files larger than 4 GiB may depend on ZIP64 and adequate guest-system support.
- Snapshots support guest rollback but do not replace backup or containment.
- Recovered objects remain untrusted until validation in a clean, isolated environment.

## 9. Evidence record

Complete one record for each object:

| Field | Record |
|---|---|
| Experiment identifier |  |
| Responsible party |  |
| UTC date and time |  |
| System and version |  |
| Tools and versions |  |
| Reference filename |  |
| Exact size in bytes |  |
| Reference-file SHA-256 |  |
| Protected location of preserved copy |  |
| Working-copy SHA-256 |  |
| Isolation controls reviewed |  |
| Notes and limitations |  |

Do not publish personal paths, credentials, sensitive data, or information that identifies victims.

## 10. Troubleshooting

### Insufficient space

Stop preparation, preserve existing records, and choose a smaller size or an authorized volume with adequate capacity. Do not delete evidence to free space during an active experiment.

### Incompatible ZIP or a file larger than 4 GiB

Confirm ZIP64 support in every tool. If packaging is not part of the experimental question, consider using the binary file directly or a smaller set.

### The manifest reports a missing file

Run the check from the directory containing the filename recorded in the manifest. Renaming or moving only one of the two objects breaks manifest resolution.

### The digest changes after a copy

Do not proceed. Repeat the copy from the preserved reference, inspect the storage, and record the event. Do not replace the expected digest with the new value without investigating the difference.

## 11. References

- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Available at: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Accessed: 1 September 2026.
- FREE SOFTWARE FOUNDATION. *GNU Coreutils: dd invocation*. Available at: <https://www.gnu.org/software/coreutils/manual/html_node/dd-invocation.html>. Accessed: 1 September 2026.
- NATIONAL INSTITUTE OF STANDARDS AND TECHNOLOGY. *Secure Hash Standard (SHS)*. FIPS PUB 180-4. Gaithersburg, 2015. Available at: <https://doi.org/10.6028/NIST.FIPS.180-4>. Accessed: 1 September 2026.
- CAATINGA MALWARE DB. [Report editorial standard and guide catalog](../CMDB-Reports-Guide-EN.md).

## 12. Editorial validation

| Role | Name | Status | Date/validated version |
|---|---|---|---|
| Author | Romário J. O. Veloso | Signature pending | — |
| Technical reviewer | To be assigned | Pending | — |
| Editorial approval | To be assigned | Pending | — |

Signatures must be recorded only after technical and editorial review of the version intended for publication.
