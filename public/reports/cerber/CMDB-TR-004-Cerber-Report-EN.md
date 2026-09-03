# Cerber Ransomware

**English** | [Português (Brasil)](./CMDB-TR-004-Cerber-Report-pt-BR.md)

> **Federal University of Pernambuco — UFPE** \
> **Center for Technology and Geosciences — CTG** \
> **Lato Sensu Graduate Program in Offensive Security and Cyber Intelligence** \
> **Caatinga Malware DB (CMDB) · Academic technical report**

**Subtitle:** Dynamic analysis and defensive evaluation of the Trend Micro Ransomware File Decryptor on Windows 7

**Romário J. O. Veloso¹**

¹ Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife — PE, Brazil.

**Author contribution:** laboratory planning and execution, evidence collection, result analysis, and report writing.

> **Safety notice:** this document records an analysis already performed with real ransomware. It is not an execution guide. Any reproduction requires formal authorization, an isolated and disposable environment, controlled networking, and restoration capability.

This report follows the Caatinga Malware DB (CMDB) template, adapted from the [FIRST Malware Analysis SIG](https://www.first.org/global/sigs/malware/ma-framework/) _Cyber Malware Analysis Report Template v1_ (2021) and the UFPE/CTG editorial structure adopted by the project.

## Document control

| Field | Information |
|---|---|
| Identifier | `CMDB-TR-004` |
| Version | `0.1.0` |
| Publication date | `2026-08-29` (draft) |
| Editorial status | Draft |
| Location | Recife — PE, Brazil |

## How to cite

> VELOSO, Romário J. O. **Cerber ransomware: dynamic analysis and defensive evaluation of the Trend Micro Ransomware File Decryptor on Windows 7**. Caatinga Malware DB (CMDB). Recife: UFPE/CTG, 2026. Technical report `CMDB-TR-004`, version 0.1.0. Available at: https://github.com/UFPE-Seguranca-Ofensiva/caatinga-malware-db/blob/main/docs/reports/cerber/CMDB-TR-004-Cerber-Report-EN.md. Accessed: 29 Aug. 2026.

## Version history

| Version | Date | Change description | Responsible person |
|---|---|---|---|
| 0.1.0 | 2026-08-29 | Initial report based on the laboratory evidence collected on 2026-08-29. | Romário J. O. Veloso |

## Version sign-off

| Role | Name | Date | Validated version |
|---|---|---|---|
| Responsible author | Romário J. O. Veloso | 2026-08-29 | 0.1.0 |
| Technical reviewer | Pending | — | — |
| Advisor or responsible faculty member | Pending | — | — |
| CMDB editorial approval | Pending | — | — |

- **Versioned package:** not included with this report.
- **Analyzed artifact:** executable identified by source-reported SHA-256 `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` and the author's notes.

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

This report documents an academic dynamic analysis of Cerber ransomware in a Windows 7 virtual machine. A sample obtained from `ytisf/theZoo` produced no observable infection; the cause could not be determined. A later sample reported by MalwareBazaar as SHA-256 `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` produced `.cerber` files, `# DECRYPT MY FILES #` notes, and a modified desktop. Through the No More Ransom flow, the author reported receiving a `.dmg` file and manually changing its extension to `.exe`; the renamed file produced a Windows error. A tool obtained directly from Trend Micro's official support page started scanning, but the latest evidence shows one infected file, zero decrypted files, and `00:50:23` elapsed. The experiment therefore does not demonstrate successful recovery. For the Cerber family, the tool supports only CERBER V1 and has material variant, duration, and recovery-integrity limitations.

**Keywords:** Cerber; ransomware; dynamic analysis; decryption; Windows 7.

## 2. Legal disclaimer

This report is intended for teaching, research, and cyber defense. The repository [disclaimer](../../../DISCLAIMER.md), [security guidance](../../../SECURITY.md), and access and use rules apply.

Hashes and source links are included for identification, traceability, and defense. No part of this document authorizes execution on third-party systems, propagation, control evasion, or non-consensual offensive use. No malware sample was added with this report.

## 3. About the analyzed malware

Microsoft published its Cerber description in March 2016 and classifies the family as _ransomware as a service_ (RaaS), then distributed through malicious attachments, exploit kits, and drive-by downloads [2]. Documented variants renamed encrypted files, applied extensions such as `.cerber`, and created `# DECRYPT MY FILES #` notes in HTML, TXT, VBS, or URL formats. A VBS component could use Windows speech synthesis to announce the encryption [2].

The `.cerber` extension, ransom-note names, and audible warning reported by the author are compatible with this family. They do not establish the exact variant, however. There is also no evidence in this study to characterize the sample as exploiting a zero-day vulnerability.

### 3.1. Samples and traceability

| Source or stage | SHA-256 | Experiment outcome | Note |
|---|---|---|---|
| theZoo | `e67834d1e8b38ec5864cfa101b140aeaba8f1900a6e269e6a94c90fcbfe56678` | No observable infection | The cause was not determined; failure, incompatibility, and self-deletion remain hypotheses only. |
| Candidate shown in Figure 1 | `4a2ad49c934f9ae6ca6b5d0c7cc34f5e12d349640012fa8cf8eb7e2d3acd6c9f` | Not tied to the final result | The capture records a search stage; this is not the effective sample hash below. |
| MalwareBazaar sample reported as effective | `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` | Produced the effects in Figures 2–4, according to the author's record | The executable was not provided with the report, so its hash could not be recalculated locally. |

The public theZoo directory contains a `Ransomware.Cerber` entry and checksum files [3]. The absence of observable infection does not establish that this sample is harmless or prove self-deletion. MalwareBazaar identifies the effective sample as `Cerber`, type `exe`, with 272,329 bytes and first seen at `2020-11-06 10:39:16 UTC` [1]. The source draft also records MD5 `8b6bc16fd137c09a08b02bbe1bb7d670` for the theZoo sample; it is retained for legacy correlation only.

### 3.2. Effective sample metadata reported by MalwareBazaar

| Indicator | Value |
|---|---|
| SHA-256 | `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` |
| SHA3-384 | `f722176961c08b2df7ce130decde16d4accc239ca003ec352ccd7bd8607fe02d217f3c7b458a4c8e52ce4186688dcf00` |
| SHA-1 | `04b3bb677dcc069ec6c664fe6858514ac4bb7305` |
| MD5 | `fabda8e31024cb3b78870ff8d6c091c4` |
| imphash | `7bdf484e04ff3560b3a25691c25e7656` |
| MalwareBazaar humanhash | `snake-tennessee-fillet-neptune` |
| First / last seen | `2020-11-06 10:39:16 UTC` / `2020-11-07 12:47:54 UTC` |
| Size and type | 272,329 bytes; `exe`; MIME `application/x-dosexec` |

MD5 and SHA-1 are retained only for correlation with legacy databases. The values above were transcribed from the source record; the sample was not available in the report directory for local hash recalculation.

## 4. Activities performed

- A Cerber sample from `ytisf/theZoo` was evaluated but produced no observable infection; the cause remains undetermined.
- Several MalwareBazaar candidates were consulted. Figure 1 records one candidate, not the sample that produced the infection.
- The author reported obtaining the effective sample from MalwareBazaar and executing it in the authorized virtual machine.
- File encryption, ransom notes, and the modified desktop were recorded.
- The No More Ransom CERBER V1 entry and its 2016 manual were consulted.
- According to the author, the file obtained through that flow had a `.dmg` extension. After it was manually changed to `.exe`, Windows produced the error in Figure 6; no usable Windows executable was located in that material.
- The recovery tool referenced by Trend Micro's current official page was opened and a scan was started; no completion capture or recovered file was supplied.

| Sample field | Value |
|---|---|
| File name | `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` (source-reported) |
| Analyzed object | Executable obtained by the author; artifact unavailable for this review |
| Package protection | Not verifiable; package not provided |
| Package SHA-256 | Not recorded — **required before publication** |
| Extracted artifact SHA-256 | `1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9` — transcribed from MalwareBazaar, not recalculated locally |
| Acquisition source | MalwareBazaar, operated by abuse.ch |
| Source URL or record | [Effective sample record](https://bazaar.abuse.ch/sample/1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9/) |
| Acquisition date | Not recorded |
| Validation sources | MalwareBazaar and behavior documented by Microsoft [1, 2] |
| Defensive references | No More Ransom catalog, 2016 guide, and current Trend Micro solution [4–6] |
| Size and type | 272,329 bytes; `exe`; MIME `application/x-dosexec`, according to MalwareBazaar [1] |

Without the package actually used, neither its SHA-256 nor the executable hash could be verified. Both must be calculated in the authorized environment before final publication and must not be inferred from a filename.

## 5. Laboratory environment

| Item | Description |
|---|---|
| Authorization and responsible person | Academic activity reported by Romário J. O. Veloso |
| Operating system | Windows 7; architecture and patch level not recorded |
| Isolation | Virtual machine; hypervisor and integration settings not recorded |
| Network | Internet access was used; segmentation and egress controls were not documented |
| Security controls | According to the author, Windows Firewall and all Windows Defender settings were disabled before sample execution; their exact states were not preserved in the supplied evidence |
| Tools and versions | Web browser; file identified as `Trend Micro Ransomware Decryptor_V1.0.1001`, reported as `.dmg` and later renamed to `.exe`; Trend Micro Ransomware File Decryptor `1.0.1668 MUI`, obtained directly from Trend Micro |
| Tool integrity | Package and executable hashes not recorded |
| Restoration | Snapshot or restoration image not documented |
| Analysis date | `2026-08-29` |

The **User Account Control (UAC)** state was not recorded. UAC is the Windows protection that requests confirmation when a program attempts administrative changes; it is distinct from Windows Firewall and Windows Defender.

Disabling the latter two controls is recorded only as a historical condition of the experiment, not as a requirement or recommendation. It reduced the system's defensive layers and increased the risk of uncontrolled network activity and impact within the environment, particularly because isolation and egress filtering were not documented.

The downloaded No More Ransom object was not made available for this review with its original name, hash, and content type, so its `.dmg` extension remains author-reported. Changing an extension does not convert the file's internal format; therefore, Figure 6 does not demonstrate incompatibility of a legitimate Windows decryptor. The absent hashes, architecture details, network controls, and final scan capture further limit reproducibility. The visible capture times also do not establish a strict chronology for every interface step.

## 6. Dynamic analysis evidence

The figures begin with image 10 supplied by the author. They document the experiment but do not replace logs, hashes calculated over the files used, or a forensic system image. The author reported disabling Windows Firewall and Windows Defender, but that action is not shown in the included figures and therefore remains a declared condition rather than an independently visible finding.

### 6.1. Sample selection and infection

Figure 1 shows a separate MalwareBazaar candidate with SHA-256 `4a2ad49c934f9ae6ca6b5d0c7cc34f5e12d349640012fa8cf8eb7e2d3acd6c9f`. It is not the effective sample identified in Section 3.

**Figure 1 — Separate MalwareBazaar candidate consulted during the search**

![MalwareBazaar record for a separate Cerber candidate](img/01-malwarebazaar-candidate.png)

**Source:** Reproduction of [MalwareBazaar](https://bazaar.abuse.ch/sample/4a2ad49c934f9ae6ca6b5d0c7cc34f5e12d349640012fa8cf8eb7e2d3acd6c9f/); capture by the author (2026).

After the effective sample was executed, the working directory contained ransom-note files and test files renamed with the `.cerber` extension.

**Figure 2 — Files carrying the `.cerber` extension after infection**

![Windows Explorer showing ransom notes and two files with the Cerber extension](img/02-encrypted-files.png)

**Source:** Author's collection (2026).

The text ransom note identified the event as “Cerber Ransomware.” The author also reported a persistent audible warning. A static image cannot establish audio, but speech synthesis is consistent with behavior documented by Microsoft for Cerber variants [2].

**Figure 3 — Cerber text ransom note**

![Cerber ransom instructions displayed in Windows Notepad](img/03-ransom-note.png)

**Source:** Author's collection (2026).

The desktop background was also replaced with ransom instructions and payment addresses.

**Figure 4 — Desktop modified by the ransomware**

![Windows desktop displaying Cerber ransom instructions](img/04-desktop-wallpaper.png)

**Source:** Author's collection (2026).

### 6.2. Recovery-resource compatibility

The No More Ransom catalog identifies the Trend Micro decryptor specifically for CERBER V1 and advises reading the guide and removing the malware before recovery [4]. According to the author, the file obtained through that path had a `.dmg` extension, an Apple disk-image format normally used by macOS. Because no usable `.exe` was located in that material, the extension was manually changed from `.dmg` to `.exe` before the attempt recorded in Figure 6.

**Figure 5 — CERBER V1 entry and file reported by the author as `.dmg`**

![No More Ransom CERBER V1 entry and the file obtained by the author before execution was attempted](img/05-nomore-ransom-legacy-download.png)

**Source:** Reproduction of No More Ransom; capture by the author (2026) [4].

Renaming a file changes only its name; it does not transform an Apple disk image into a Windows PE executable. The error below therefore documents the attempt with the renamed file, not a valid evaluation of an official Windows decryptor.

**Figure 6 — Error after manually changing the extension from `.dmg` to `.exe`**

![Windows error shown after opening the file whose extension had been changed to exe](img/06-legacy-tool-incompatibility.png)

**Source:** Author's collection (2026).

The linked manual was produced in 2016 and refers to the former solution `1114221` and a ZIP package for version `1.0.1654` [5], which differs from the `.dmg` file reported during the experiment. Because the original extension is not fully visible in the captures and the object was not made available for inspection, this discrepancy could not be reproduced independently. The result also cannot be generalized to every No More Ransom decryptor.

After finding no usable `.exe` through that flow, the author consulted Trend Micro's current solution `KA-0006362`, updated on 30 September 2024 [6]. The laboratory capture shows the Windows executable `RansomwareFileDecryptor 1.0.1668 MUI` opened from that official source.

**Figure 7 — Current Trend Micro tool launched in the laboratory**

![Trend Micro Ransomware File Decryptor version 1.0.1668 displaying its terms](img/07-trend-micro-current-tool.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

### 6.3. Local recovery attempt

The tool presented a supported-family selector. The author selected `CERBER(V1)`.

**Figure 8 — Ransomware-family selection screen**

![Trend Micro tool displaying its ransomware selector](img/08-ransomware-family-selector.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

The interface warned that Cerber-encrypted files might not be completely recovered and could require later repair.

**Figure 9 — CERBER V1 selection and partial-recovery warning**

![Trend Micro selector showing CERBER V1 and a warning about incomplete recovery](img/09-cerber-v1-warning.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

**Figure 10 — CERBER selected for the recovery attempt**

![Trend Micro tool showing CERBER as the selected family](img/10-cerber-selected.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

The affected Downloads directory was selected as the target.

**Figure 11 — Target-directory selection**

![Trend Micro tool displaying the Downloads directory and encrypted files](img/11-target-folder-selection.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

Figure 12 preserves the initial scan record, with one infected file and zero decrypted files. In a later capture supplied by the author during review, the process was still running after `00:50:23`—50 minutes and 23 seconds—with the same counters. No completion screen or recovered-file validation was preserved.

**Figure 12 — Initial scan record with no decrypted file**

![Trend Micro scan showing eight seconds elapsed, one infected file, and zero decrypted files](img/12-scan-in-progress.png)

**Source:** Trend Micro interface; capture by the author (2026) [6].

### 6.4. Official scope and limitations

For the Cerber family, Trend Micro lists only **CERBER V1**, with the pattern `{10 random characters}.cerber`, among the variants supported by this tool.

**Figure 13 — CERBER V1 support documented by Trend Micro**

![Trend Micro table listing CERBER V1 and its encrypted filename pattern](img/13-trend-micro-supported-cerber-v1.png)

**Source:** Reproduction of Trend Micro's support solution (2026) [6].

For Cerber, Trend Micro states that decryption must run on the infected machine because the tool searches for the first infected file for a critical calculation. The documented average is approximately four hours on a standard dual-core Intel i5; more CPU cores may reduce the probability of success because of the encryption logic. Some files may be recovered only partially and require subsequent repair [6].

**Figure 14 — CERBER decryption limitations published by Trend Micro**

![Trend Micro text describing same-machine, duration, processor, and partial-recovery limitations](img/14-trend-micro-cerber-limitations.png)

**Source:** Reproduction of Trend Micro's support solution (2026) [6].

The next two figures are manufacturer examples of how a successful completion screen may appear. They are not evidence of success in this experiment.

**Figure 15 — Trend Micro example showing 86 of 86 files decrypted**

![Manufacturer example showing a completed scan with 86 infected and 86 decrypted files](img/15-trend-micro-success-example-86.png)

**Source:** Trend Micro manufacturer example; not a local result (2026) [6].

**Figure 16 — Trend Micro example showing 27 of 27 files decrypted**

![Manufacturer example showing a completed scan with 27 infected and 27 decrypted files](img/16-trend-micro-success-example-27.png)

**Source:** Trend Micro manufacturer example; not a local result (2026) [6].

## 7. Conclusion

The experiment recorded behavior consistent with Cerber: test files received the `.cerber` extension, ransom-note files were created, and the desktop was modified. The theZoo sample caused no observable infection, for an undetermined reason. The effective MalwareBazaar sample's identity is source-reported because neither the package nor the extracted executable was available for local rehashing.

Recovery was not demonstrated. The `.dmg` file reported as coming from the No More Ransom flow was renamed to `.exe`; the resulting error is not a valid test of a Windows executable. The tool obtained directly from Trend Micro's official solution was still scanning in the latest evidence. Because the tool's Cerber coverage is limited to CERBER V1 and the recovery method has substantial same-machine, time, processor, and partial-recovery limitations, future validation must preserve the sample and tool hashes, confirm the exact variant, capture the final result, and compare controlled files before encryption and after recovery. In a real incident, isolation, evidence preservation, validated eradication, and restoration from trusted backups remain the priority; a decryptor does not replace those controls.

## 8. References

1. ABUSE.CH. **MalwareBazaar: SHA-256 1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9 (Cerber)**. [S. l.], 2020. Available at: https://bazaar.abuse.ch/sample/1cb6e2a2526f332fe132ab8905cd4cae65a1f7ef7aa4f9bf351f7f323f3b32c9/. Accessed: 29 Aug. 2026.
2. MICROSOFT. **Ransom:Win32/Cerber**. Microsoft Security Intelligence, 12 Mar. 2016; updated 10 Jan. 2018. Available at: https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?name=Win32%2FCerber. Accessed: 29 Aug. 2026.
3. YTISF. **theZoo: Ransomware.Cerber**. GitHub. Available at: https://github.com/ytisf/theZoo/tree/master/malware/Binaries/Ransomware.Cerber. Accessed: 29 Aug. 2026.
4. NO MORE RANSOM. **Decryption tools: CERBER V1 Ransom**. [S. l.], [n. d.]. Available at: https://www.nomoreransom.org/en/decryption-tools.html. Accessed: 29 Aug. 2026.
5. TREND MICRO. **Using the Trend Micro Ransomware File Decryptor Tool**. 2016. Available at: https://www.nomoreransom.org/uploads/TrendMicro_how-to_guide.pdf. Accessed: 29 Aug. 2026.
6. TREND MICRO. **Downloading and Using the Trend Micro Ransomware File Decryptor**. Updated 30 Sept. 2024. Available at: https://success.trendmicro.com/en-US/solution/KA-0006362. Accessed: 29 Aug. 2026.
