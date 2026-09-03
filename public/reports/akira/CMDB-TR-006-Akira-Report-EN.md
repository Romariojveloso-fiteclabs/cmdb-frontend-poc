# Akira Ransomware

**English** | [Português (Brasil)](./CMDB-TR-006-Akira-Report-pt-BR.md)

> **Federal University of Pernambuco — UFPE**  
> **Center for Technology and Geosciences — CTG**  
> **Lato Sensu Graduate Program in Offensive Security and Cyber Intelligence**  
> **Caatinga Malware DB (CMDB) · Academic technical report**

**Subtitle:** comparative dynamic analysis and limitations of the Avast Decryption Tool on Windows 7

**Romário J. O. Veloso¹**

¹ Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife — PE, Brazil.

> **Safety notice:** this document records experiments already conducted with malicious software for study and defense. Do not execute samples outside an isolated, authorized laboratory prepared for restoration.

Template adapted from the *Cyber Malware Analysis Report Template v1* (2021), by the [FIRST Malware Analysis SIG](https://www.first.org/global/sigs/malware/ma-framework/), and from the UFPE/CTG editorial structure adopted by the project.

## Document control

| Field | Information |
|---|---|
| Identifier | `CMDB-TR-006` |
| Version | `0.1.0` |
| Publication date | `2026-09-01` |
| Editorial status | Draft |
| Location | Recife — PE, Brazil |

## How to cite

> VELOSO, Romário J. O. **Akira Ransomware: comparative dynamic analysis and limitations of the Avast Decryption Tool on Windows 7**. Caatinga Malware DB (CMDB). Recife: UFPE/CTG, 2026. Technical report `CMDB-TR-006`, version 0.1.0. Available at: [permanent URL after publication]. Accessed: [date].

## Version history

| Version | Date | Change description | Responsible person |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Initial organization of the report, separation of the two experiments, and evidence selection. | Romário J. O. Veloso |

## Version sign-off

| Role | Name | Date | Validated version |
|---|---|---|---|
| Responsible author | Romário J. O. Veloso | Pending | — |
| Technical reviewer | Pending | — | — |
| Advisor or responsible faculty member, when applicable | Pending | — | — |
| CMDB editorial approval | Pending | — | — |

- **Versioned artifact:** `CMDB-TR-006-Akira-Report-EN.md`, version `0.1.0`.
- **Samples:** not included with the report.

## Table of contents

1. [Abstract](#1-abstract)
2. [Legal disclaimer](#2-legal-disclaimer)
3. [About the analyzed malware](#3-about-the-analyzed-malware)
4. [Activities performed](#4-activities-performed)
5. [Laboratory environment](#5-laboratory-environment)
6. [Dynamic analysis evidence](#6-dynamic-analysis-evidence)
7. [Conclusion](#7-conclusion)
8. [References](#8-references)

## 1. Abstract

This report documents two distinct academic experiments with samples attributed to Akira ransomware in a Windows 7 virtual machine. In the first experiment, files acquired the `.akira` extension, ransom notes threatened data disclosure, and Microsoft Edge failed to start while auxiliary browser files appeared encrypted. A 2023 sample whose SHA-256 is listed in the official Avast Decryption Tool manual was recognized by the tool: a pair consisting of the encrypted file and its original enabled the recovery parameter to be found, and the interface reported `790/790` files decrypted. Visual inspection showed thumbnails rendering again, but no post-recovery hashes were preserved; the result is therefore apparent functional recovery rather than proof of byte-for-byte equality. In the second experiment, the tool did not recognize a file produced by the `def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904.exe` sample recorded in MalwareBazaar in 2025. The 592-byte size difference noted in that experiment diverges from the 534-byte footer documented for the initial generation, but it does not independently determine the variant or the cause of the incompatibility. The results demonstrate that decryptors depend on the ransomware generation and cryptographic construction, and that SHA-256 values, provenance records, and complete logs are essential to support a conclusion of full recovery.

**Keywords:** Akira; ransomware; dynamic analysis; decryption; SHA-256; file recovery.

## 2. Legal disclaimer

This report is intended for teaching, research, and cyber defense. The repository [disclaimer](../../../DISCLAIMER.md), [security guidance](../../../SECURITY.md), and access and use rules apply.

Names, hashes, and links are provided for identification, traceability, and defense. This document does not authorize execution on third-party systems, control evasion, propagation, or non-consensual offensive use. The actions are described in the past tense as a laboratory record, not as instructions for activating the malware.

## 3. About the analyzed malware

Akira is a ransomware operation observed since March 2023. The initial generation included 64-bit Windows binaries written in C++, and a Linux implementation appeared later. The scheme described by the Avast team for that generation used ChaCha 2008 to encrypt data and RSA-4096 to protect the symmetric key appended to the files [2]. The updated joint advisory issued by United States authorities documents the family's evolution into different implementations and extensions, as well as its use of double extortion, combining encryption with threats to disclose data [1].

Avast released a decryptor in 2023 that exploited a flaw present in early versions. The operators corrected that flaw, and the tool's own interface warns that variants later than the supported period cannot be recovered by it [2, 3]. The `.akira` extension or the availability of a corresponding original file therefore does not establish compatibility with the decryptor.

This laboratory directly executed files previously obtained for analysis. It did not reproduce or evaluate the initial-access, lateral-movement, or exfiltration techniques described in real incidents.

## 4. Activities performed

- Two independent experiments were compared, one using a 2023 sample and the other a sample recorded in 2025.
- A reference file was preserved outside the infected working area and transported on virtual optical media together with its SHA-256 manifest.
- The Avast Decryption Tool for Akira was evaluated using known pairs consisting of an original file and its encrypted counterpart.
- The results reported by the tool, the limitations of the selected pair, and the subsequent visual inspection were recorded.
- The No More Ransom catalog and official decryptor manual [4, 5], the MalwareBazaar records [6, 7], and official defensive guidance [1–3] were consulted to correlate the samples and interpret the results.

### 4.1. Sample traceability

| Field | Experiment A — initial generation | Experiment B — recent sample |
|---|---|---|
| File name | `1b6af2fbbc636180dd7bae825486ccc45e42aefbb304d5f83fafca4d637c13cc.exe` | `def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904.exe` |
| Analyzed object | Extracted executable; package not made available in this revision | Extracted executable; package not made available in this revision |
| Package SHA-256 | Pending — the package actually used was not preserved in the report | Pending — the package actually used was not preserved in the report |
| Executable SHA-256 | `1b6af2fbbc636180dd7bae825486ccc45e42aefbb304d5f83fafca4d637c13cc` | `def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904` |
| Hash status | Transcribed from the source and the manual; not recalculated in this revision | Transcribed from the source; not recalculated in this revision |
| SHA-1 | Not recorded | `fd623c62aa8c7319bf6e6a93ace9b30d82030269` |
| MD5 | Not recorded | `ae454079c93a7a1ce276756b9d62d196` |
| Reported source | MalwareBazaar | MalwareBazaar |
| Source record | [2023 sample](https://bazaar.abuse.ch/sample/1b6af2fbbc636180dd7bae825486ccc45e42aefbb304d5f83fafca4d637c13cc/) | [2025 sample](https://bazaar.abuse.ch/sample/def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904/) |
| First recorded by the source | Not recorded in the notes | `2025-08-26 09:06:02 UTC`; not equivalent to the creation date |
| Size and type | The author's capture shows approximately 573 KB; exact size not recorded | 1,081,856 bytes; `exe`; MIME `application/x-dosexec`, according to the source |
| Independent identification | The SHA-256 appears among the Windows indicators in the official manual [5] | MalwareBazaar and the analysis engines linked from its record [7] |
| Experiment outcome | Pair recognized; apparent functional recovery | Encrypted file not recognized by the tool, according to the author's notes |

SHA-1 and MD5 are retained solely for correlation with legacy databases. SHA-256 is the preferred identifier, but a value transcribed from a source does not replace calculating it from the file actually analyzed.

### 4.2. Reference files and tools

| Object | Record |
|---|---|
| Reference file | ZIP of approximately 4.5 GiB, preserved separately; this size was an experimental choice, not a universal decryptor requirement |
| Manifest | A `.sha256` file is visible on the media; its value and the verification result were not preserved in the supplied evidence |
| Avast Decryption Tool | Version `1.0.0.838 (64-bit)`, as shown by the interface |
| Manual consulted | *User Manual — Akira Decryptor*, 10 pages [5] |
| SHA-256 of the local manual consulted | `e0585a803ab934fbc4d106eb9825fdc60307fcfade65248359ba4a5b27c0ae4e` |
| Media creation | The specific `genisoimage` invocation used by the author rejected the file larger than 4 GiB; `xorriso` produced the image. This does not establish a universal limitation of every ISO format or every version of these tools. See the [ISO media creation and validation guide](../../guides/iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md). |

### 4.3. Why the original file is required

The evaluated decryptor does not work merely from the `.akira` extension: for the vulnerable generation, it requests a **known pair** consisting of the encrypted file and the exact original that existed before encryption [2, 5]. The pair's content enables the tool to search for the recovery parameter and calculate the maximum size of other files it can process. A different file does not constitute the same original even if its name, extension, or size is similar.

In the experiment, the original was preserved outside the infected working area, and a copy was presented through an ISO mounted as optical media. The ISO reduced accidental changes to the transport medium, but it did not replace isolation or validation. The SHA-256 manifest should demonstrate that the transported copy remained identical to the preserved reference and, after recovery, enable comparison between the original and the result.

To reproduce only this preparation with synthetic data and no personal content, consult:

- the [CMDB synthetic reference-data guide](../../guides/synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md), covering synthetic files and preserved copies;
- the [CMDB ISO media creation and validation guide](../../guides/iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md), covering read-only transport; and
- the [CMDB SHA-256 recovery validation guide](../../guides/sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md), which distinguishes identity, integrity, partial recovery, and inconclusive results.

These guides document defensive preparation and verification; they do not instruct readers to acquire or execute malware.

## 5. Laboratory environment

| Item | Description |
|---|---|
| Authorization and responsible person | Academic activity reported by the author; responsible person: Romário J. O. Veloso |
| Operating system | Windows 7; edition, architecture, and update level not recorded |
| Isolation | Virtual machine; hypervisor, version, integrations, and topology not recorded |
| Data transfer | ISO image mounted as a virtual optical drive; the capture demonstrates the mounted media but does not independently validate its contents |
| Network | Web services were accessed; outbound segmentation and filtering were not documented |
| Security controls | UAC, Windows Firewall, and Windows Defender status not recorded for this experiment |
| Tools | Avast Decryption Tool for Akira `1.0.0.838 (64-bit)`; `xorriso`; `genisoimage`; versions of the latter two were not recorded |
| Restoration | Snapshot or restoration image not documented |
| Analysis date | `2026-08-31`, according to the captures |

These configuration gaps reduce reproducibility. Read-only virtual media helps preserve the file stored on it, but it does not make a VM safe or replace network segmentation, disabling host–guest integrations, and validated restoration.

## 6. Dynamic analysis evidence

The thirteen figures below were selected from seventeen captures provided by the author. Only redundant steps were omitted. The figures document **Experiment A** only. The outcome of Experiment B is available in the author's notes, with no corresponding capture in this set.

### 6.1. Sample acquisition and identification

The experiment began with the controlled acquisition of the 2023 sample from its corresponding MalwareBazaar record [6]. The package shown in the downloads folder was named after the SHA-256 attributed to the executable. This visual correspondence records the declared provenance, but it does not replace locally calculating the hashes of both the package and the extracted executable before analysis.

**Figure 1 — 2023 sample obtained from its MalwareBazaar record**

![MalwareBazaar page in the background and the sample package identified by its SHA-256 in the virtual machine downloads folder](./img/01_-_akira_amostra_de_dados.png)

**Source:** Author's collection (2026).

### 6.2. Observed impact

Immediately after execution, the laboratory recorded a console window and a Windows message stating that no disk was present in drive `D:`. The temporal relationship establishes that the event occurred during the experiment, but the capture alone cannot determine the exact cause or show that the message is a constant behavior of the family.

**Figure 2 — State observed immediately after execution**

![Windows 7 desktop with an open console and a warning that no disk was present in drive D](./img/impact-01-drive-error.png)

**Source:** Author's collection (2026).

The working directory then contained the reference file and its manifest with the `.akira` extension, together with `akira_readme` notes. This alteration is visual evidence of impact on objects in the directory; the extension alone does not establish which algorithm was applied.

**Figure 3 — Files with the `.akira` extension and ransom notes**

![Windows Explorer showing the reference file, SHA-256 manifest, and other objects with the akira extension, together with akira_readme notes](./img/impact-02-encrypted-files.png)

**Source:** Author's collection (2026).

The ransom note applied time pressure and threatened to sell or disclose information if no agreement was reached. This language seeks to induce fear, urgency, and payment, forming the psychological-coercion dimension of the double-extortion behavior documented for Akira [1]. The message does not establish that exfiltration occurred in the laboratory. The figure preserves an address and code generated during the experiment solely as historical evidence; they must not be accessed or reused.

**Figure 4 — Coercive language in the ransom note**

![The akira_readme note open in Notepad with data-disclosure threats, pressure for rapid contact, and instructions from the operators](./img/impact-03-ransom-note.png)

**Source:** Author's collection (2026).

A Microsoft Edge startup failure was also recorded. In the application's directory, auxiliary files such as `delegatedWebFeatures.sccd`, `master_preferences`, and `msedge.VisualElementsManifest.xml` had acquired the `.akira` suffix, while Windows reported an incorrect side-by-side configuration. The evidence establishes that browser dependencies were altered and that Edge did not start in that state. It does not demonstrate that the main executable was encrypted or support a general claim that every Akira variant disables every browser.

**Figure 5 — Edge failure associated with encrypted auxiliary files**

![Microsoft Edge directory with auxiliary files ending in akira and a startup error reporting an incorrect side-by-side configuration](./img/impact-04-edge-startup-failure.png)

**Source:** Author's collection (2026).

The apparent absence of encryption for some installers must likewise not be generalized across all generations; the exclusion list published for the initial variant included specific executable extensions [2].

### 6.3. Experiment A — sample recognized by the decryptor

Only after documenting the infection and its effects was the virtual recovery media mounted in the machine. It contained the reference file, its SHA-256 manifest, and the tools required for the defensive evaluation. The capture establishes the visible items, not the ISO creation process or the manifest verification result.

The [synthetic-data guide](../../guides/synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md) describes how to produce and preserve the original. The [ISO media guide](../../guides/iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md) covers creation and validation of read-only transport. The [SHA-256 validation guide](../../guides/sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md) covers verification before exposure and after recovery.

**Figure 6 — Recovery media mounted after infection**

![Windows Explorer showing the optical drive with the reference file, SHA-256 manifest, decryptor, auxiliary browser, and data file](./img/01-recovery-media.png)

**Source:** Author's collection (2026).

A preserved copy of the original was then transferred from the optical media to form the known pair. The visible names and sizes do not replace hash validation.

**Figure 7 — Known-pair preparation after infection**

![The directory contains artifacts with the akira extension while a clean copy is transferred from the optical media](./img/02-known-pair-transfer.png)

**Source:** Author's collection (2026).

When opened, the decryptor explicitly stated that variants later than the supported period were not recoverable. The message defines the tool's scope but does not independently identify a sample's generation.

**Figure 8 — Cross-generation incompatibility warning**

![The Avast Decryption Tool warns that variants later than summer 2023 cannot be recovered by the tool](./img/03-decryptor-version-warning.png)

**Source:** Avast Decryption Tool interface; capture by the author (2026) [5].

The encrypted file and its corresponding original were selected as the known pair. The documentation recommends corresponding files that are as large as possible because the pair's content determines the coverage; it does not establish 4 GiB as a mandatory minimum size [2, 5].

**Figure 9 — Encrypted and original file pair supplied to the tool**

![The Avast screen displays the paths of the file with the akira extension and its corresponding original](./img/04-known-file-pair.png)

**Source:** Avast Decryption Tool interface; capture by the author (2026) [5].

For this pair and this run, the tool calculated that it could recover files up to 1,152 MB. This is a limit derived from the selected pair, not a universal decryptor capability.

**Figure 10 — Coverage calculated for the selected pair**

![Avast reports a calculated limit of 1152 MB and suggests choosing another pair to reach larger files](./img/05-pair-coverage-limit.png)

**Source:** Avast Decryption Tool interface; capture by the author (2026) [5].

The interface then reported that the recovery parameter had been found.

**Figure 11 — Recovery parameter found**

![The Avast window displays the message Password found without revealing the value](./img/06-password-recovery-result.png)

**Source:** Avast Decryption Tool interface; capture by the author (2026) [5].

During the operation, the counter reached `790/790` files in two seconds. This number is a result reported by the tool itself, not an independent verification of each output.

**Figure 12 — Operational decryption counter**

![The Avast window shows a count of 790 out of 790 files and an elapsed time of two seconds](./img/07-decryption-counter.png)

**Source:** Avast Decryption Tool interface; capture by the author (2026) [5].

Subsequent inspection showed thumbnails rendering again and encrypted copies preserved with the `.akira.backup` suffix. This supports apparent functional recovery of part of the viewed set but does not establish the byte-for-byte identity of 790 files.

**Figure 13 — Rendered files after recovery and encrypted copies**

![Windows Explorer showing images rendered again alongside copies with the akira.backup suffix](./img/08-recovered-files-and-backups.png)

**Source:** Author's collection (2026).

### 6.4. Experiment B — recent sample not recognized

In an independent experiment, the `def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904.exe` sample, with SHA-256 `def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904` and first recorded by MalwareBazaar on 26 August 2025, produced an `.akira` file. When given the known pair, the Avast Decryption Tool displayed the message `The file is not encrypted or was not recognized.`, according to the author's notes. No capture or log from this run was provided, so the result remains an observation reported by the author.

The reference file was 4,831,838,496 bytes, and the processed file was 4,831,839,088 bytes: a measured increase of 592 bytes. The initial generation described by Avast appended a 534-byte footer [2, 5]. This discrepancy suggests a different format or metadata, but size alone does not identify the algorithm, variant, or exact reason for rejection. Similarly, “first seen” records when the source observed the file, not when it was created or compiled.

The outcome is consistent with the publicly documented limitation that the flaw exploited by the decryptor was corrected in later generations [3]. Nevertheless, without static analysis, logs, and hash validation of the pair, the only technically supported conclusion is that **the artifact produced in Experiment B was not recognized by the decryptor tested**.

### 6.5. Validation, limitations, and interpretation

Experiment A did not preserve post-recovery SHA-256 hashes, the complete log, or a mapping between the counter and each output. The outcome was therefore classified as **apparent functional recovery**, not full recovery. Establishing byte-for-byte equality requires comparing, in a trusted environment, each recovered file's SHA-256 with the value for its preserved original.

The report also lacks the packages actually used to recalculate their hashes and locally confirm the executable hashes. Until these integrity gaps are resolved, the document must remain a draft and does not meet the CMDB editorial criteria for final publication.

Future experiments should:

- calculate separate SHA-256 values for the package, extracted executable, preserved original, encrypted file, and recovered file;
- keep the manifest outside the compromised VM and verify it again in a trusted environment;
- record the exact size, timestamp, tool versions, VM configuration, and complete logs;
- test files of different types and sizes, because a single large ZIP does not represent the entire dataset; and
- classify the outcome as exact recovery, partial/functional recovery, failure, or inconclusive.

The reusable procedures are documented in the [synthetic-data guide](../../guides/synthetic-reference-data/CMDB-GD-001-Synthetic-Reference-Data-Guide-EN.md), the [ISO media guide](../../guides/iso-media/CMDB-GD-004-ISO-Data-Media-Guide-EN.md), and the [SHA-256 recovery validation guide](../../guides/sha256-validation/CMDB-GD-002-SHA256-Recovery-Validation-Guide-EN.md).

## 7. Conclusion

The experiments demonstrated two behaviors that must not be conflated. Experiment A documented `.akira` files, distributed ransom notes, coercion through threats of data disclosure, and an Edge failure associated with encrypted auxiliary files; the 2023 sample was recognized by the decryptor and produced signs of functional recovery. In Experiment B, the artifact generated by the sample recorded in 2025 was not recognized. The contrast is consistent with Akira's evolution and the limited scope declared by Avast, but it does not prove which cryptographic change caused the incompatibility.

The `790/790` count, the `Password found` message, and the rendered thumbnails are useful evidence, but they are insufficient to establish full recovery without post-recovery hashes. In real incidents, the priorities remain isolating the system, preserving evidence, engaging specialized incident-response personnel, and restoring data from trusted backups. A decryptor should be treated as a variant-specific resource, never as a universal recovery guarantee.

## 8. References

1. FEDERAL BUREAU OF INVESTIGATION et al. *#StopRansomware: Akira Ransomware*. Updated 13 Nov. 2025. Available at: <https://www.fbi.gov/file-repository/cyber-alerts/stopransomware-akira-ransomware.pdf>. Accessed: 1 Sept. 2026.
2. AVAST THREAT RESEARCH TEAM. *Decrypted: Akira ransomware*. 29 June 2023. Available at: <https://decoded.avast.io/threatresearch/decrypted-akira-ransomware/>. Accessed: 1 Sept. 2026.
3. AVAST THREAT RESEARCH TEAM. *Avast Q2/2023 Threat Report*. 2023. Available at: <https://decoded.avast.io/threatresearch/avast-q2-2023-threat-report/>. Accessed: 1 Sept. 2026.
4. NO MORE RANSOM. *Decryption Tools: Akira*. Available at: <https://www.nomoreransom.org/en/decryption-tools.html>. Accessed: 1 Sept. 2026.
5. AVAST. *User Manual — Akira Decryptor*. Available at: <https://www.nomoreransom.org/uploads/User%20Manual%20-%20Akira_Decryptor.pdf>. Accessed: 1 Sept. 2026.
6. MALWAREBAZAAR. *Database entry: SHA-256 1b6af2fbbc636180dd7bae825486ccc45e42aefbb304d5f83fafca4d637c13cc*. abuse.ch. Available at: <https://bazaar.abuse.ch/sample/1b6af2fbbc636180dd7bae825486ccc45e42aefbb304d5f83fafca4d637c13cc/>. Accessed: 1 Sept. 2026.
7. MALWAREBAZAAR. *Database entry: SHA-256 def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904*. abuse.ch. Available at: <https://bazaar.abuse.ch/sample/def3fe8d07d5370ac6e105b1a7872c77e193b4b39a6e1cc9cfc815a36e909904/>. Accessed: 1 Sept. 2026.
