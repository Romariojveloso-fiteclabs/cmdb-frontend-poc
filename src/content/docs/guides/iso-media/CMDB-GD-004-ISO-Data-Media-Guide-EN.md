# CMDB Guide — creating and validating ISO data media

**English** | [Português (Brasil)](./CMDB-GD-004-ISO-Data-Media-Guide-pt-BR.md)

**Federal University of Pernambuco (UFPE)**  
**Center for Technology and Geosciences (CTG)**  
**Lato Sensu Graduate Program in Offensive Security and Cyber Intelligence**  
**Caatinga Malware DB (CMDB)**

## Document control

| Field | Value |
|---|---|
| Identifier | `CMDB-GD-004` |
| Version | `0.1.0` |
| Status | Draft |
| Date | 2026-09-01 |
| Language | English (`en`) |

## Authorship and contribution

**Author:** Romário J. O. Veloso  
**Affiliation:** Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife, Pernambuco, Brazil.  
**Contribution:** experimental procedure design, recording of observed limitations, and initial drafting.  
**ORCID and institutional email:** not provided.

### Suggested citation

VELOSO, Romário J. O. *CMDB Guide — creating and validating ISO data media*. Recife: Federal University of Pernambuco, 2026. Version 0.1.0. Work in progress.

## Version history

| Version | Date | Responsible party | Change |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | ISO media procedure separated from the synthetic-data guide. |

## Contents

1. [Purpose, scope, and audience](#1-purpose-scope-and-audience)
2. [Safety notice](#2-safety-notice)
3. [Prerequisites and inputs](#3-prerequisites-and-inputs)
4. [Media staging](#4-media-staging)
5. [ISO creation and identification](#5-iso-creation-and-identification)
6. [Content validation](#6-content-validation)
7. [Presentation to the virtual machine](#7-presentation-to-the-virtual-machine)
8. [Acceptance criteria](#8-acceptance-criteria)
9. [Limitations and troubleshooting](#9-limitations-and-troubleshooting)
10. [Evidence record](#10-evidence-record)
11. [References](#11-references)
12. [Editorial validation](#12-editorial-validation)

## 1. Purpose, scope, and audience

This guide describes how to stage, create, identify, and validate a data ISO intended to transport a **previously verified working copy** to a laboratory virtual machine.

Synthetic-content creation is outside this procedure. Prepare and preserve the material according to the [CMDB Guide to creating and preserving synthetic reference data](../synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md) before starting.

This document does not teach malware acquisition or execution. The ISO should contain only the data and manifests required by the experiment. When tools or installers are indispensable, use separate media and record their official sources, versions, signatures, and SHA-256 values.

## 2. Safety notice

An ISO mounted as an optical drive reduces accidental writes to the medium presented to the guest, but it does not make the virtual machine safe. It does not prevent virtualization escape, exfiltration, configuration errors, or host compromise.

- produce and validate the ISO on a trusted host;
- do not include credentials, personal documents, or broad directories;
- keep the preserved copy outside every guest share;
- disable unnecessary host–guest integrations;
- record network and snapshot configuration; and
- treat every file copied back from the guest as untrusted.

## 3. Prerequisites and inputs

- trusted GNU/Linux host;
- `xorriso`, `sha256sum`, and mounting utilities approved by the laboratory;
- space for the staging tree, ISO, and records;
- validated working copy;
- corresponding SHA-256 manifest; and
- guest system compatible with the ISO level and file sizes.

The example uses this layout:

```text
cmdb-reference-lab/
├── staging/
│   └── data/
│       ├── reference-file.zip
│       └── reference-file.zip.sha256
└── preserved/
    ├── reference-file.zip
    └── reference-file.zip.sha256
```

Adapt the names, but do not use the preserved copy as the direct ISO input.

## 4. Media staging

Enter the experiment directory and explicitly inspect every file to be included:

```bash
cd -- cmdb-reference-lab
find staging -type f -printf '%P\t%s bytes\n'
(cd staging/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Do not use `.` or a broad directory as the source without a prior inventory. Doing so can include hidden files, credentials, or other unintended objects.

## 5. ISO creation and identification

Create the image with `xorriso` in `mkisofs` compatibility mode:

```bash
xorriso -as mkisofs \
  -o reference-data.iso \
  -iso-level 3 \
  -J \
  -R \
  staging/
```

Then record and verify the ISO's own SHA-256:

```bash
sha256sum -- reference-data.iso > reference-data.iso.sha256
sha256sum --check --strict -- reference-data.iso.sha256
```

The ISO 9660 level must support the objects' sizes and the guest system. In the experiment underlying this guide, one specific `genisoimage` invocation rejected a file larger than 4 GiB, while `xorriso` produced the image. This observation does not establish a universal limitation of `genisoimage`, every ISO level, or every version.

## 6. Content validation

List the recorded tree:

```bash
xorriso -indev reference-data.iso -ls /
```

The listing confirms names, not byte integrity. Mount the ISO read-only in a clean environment and validate the manifest again. Mount points vary; the following example uses `/media/iso`:

```bash
(cd /media/iso/data && sha256sum --check --strict -- reference-file.zip.sha256)
```

Do not proceed after a failed check. Recreate the working copy from the preserved reference, investigate the difference, and generate a new ISO under a new evidence name or version.

## 7. Presentation to the virtual machine

Attach `reference-data.iso` as a virtual optical drive. Confirm in the hypervisor that the medium does not provide a write path to the host.

Before the experiment:

1. record the mounted ISO's name and SHA-256;
2. visually confirm the presented files;
3. copy only the working copy to the guest's internal disk;
4. calculate the copy's SHA-256 in the guest when the tool is available; and
5. keep the preserved copy inaccessible to the guest.

Do not run the experiment directly on the ISO. It is a transport and input-preservation medium, not the experiment's working area.

## 8. Acceptance criteria

The media is ready only when:

- the staging area has been inventoried;
- the manifest validates the working copy before creation;
- the ISO's SHA-256 has been recorded and confirmed;
- the mounted content validates against the manifest;
- guest compatibility has been checked;
- the preserved copy remains separate; and
- tool, version, date, operator, and limitations have been recorded.

## 9. Limitations and troubleshooting

### File larger than 4 GiB

A file larger than 4 GiB requires a compatible combination of ISO level, generator, and reader. Do not attribute every failure to the ISO format; record the command, version, complete error message, and source filesystem.

### The ISO lists the file, but the manifest fails

Listing does not check bytes. Stop the workflow, compare the working copy with the preserved copy, and recreate the media.

### The guest cannot read the media

Test the ISO in a clean environment and check the compatibility of the ISO level and extensions. Do not shrink, rename, or reconstruct the object without creating a new evidence record.

### The media is read-only, but the VM remains exposed

This is expected: read-only is a property of the presented medium, not a complete containment mechanism.

## 10. Evidence record

| Field | Record |
|---|---|
| Experiment identifier |  |
| Responsible party and UTC date/time |  |
| Tool, version, and command |  |
| Staging-area inventory |  |
| Working-copy SHA-256 |  |
| ISO name, size, and SHA-256 |  |
| Mounted-media validation result |  |
| Hypervisor and drive configuration |  |
| Guest system and compatibility |  |
| Limitations and events |  |

## 11. References

- GNU PROJECT. *xorriso*. Available at: <https://www.gnu.org/software/xorriso/xorriso.html>. Accessed: 1 September 2026.
- FREE SOFTWARE FOUNDATION. *GNU Coreutils: sha2 utilities*. Available at: <https://www.gnu.org/software/coreutils/manual/html_node/sha2-utilities.html>. Accessed: 1 September 2026.
- CAATINGA MALWARE DB. [Report editorial standard and guide catalog](../CMDB-Reports-Guide-EN.md).

## 12. Editorial validation

| Role | Name | Status | Date/validated version |
|---|---|---|---|
| Author | Romário J. O. Veloso | Signature pending | — |
| Technical reviewer | To be assigned | Pending | — |
| Editorial approval | To be assigned | Pending | — |

