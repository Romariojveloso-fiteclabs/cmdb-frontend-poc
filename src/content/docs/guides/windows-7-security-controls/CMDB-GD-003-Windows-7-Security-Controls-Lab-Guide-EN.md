# CMDB Guide — temporary configuration of Windows 7 security controls in a laboratory

**English** | [Português (Brasil)](./CMDB-GD-003-Windows-7-Security-Controls-Lab-Guide-pt-BR.md)

**Federal University of Pernambuco (UFPE)**  
**Center for Technology and Geosciences (CTG)**  
**Postgraduate Program in Offensive Security and Cyber Intelligence**  
**Caatinga Malware DB (CMDB)**

## Document control

| Field | Value |
|---|---|
| Identifier | `CMDB-GD-003` |
| Version | `0.1.0` |
| Status | Draft |
| Date | 2026-09-01 |
| Language | English (`en`) |

## Authorship and contribution

**Author:** Romário J. O. Veloso  
**Affiliation:** Undergraduate student in Electronic Engineering, Federal University of Pernambuco (UFPE), Recife, Pernambuco, Brazil.  
**Contribution:** laboratory execution and procedure recording, screenshot production, and initial drafting.  
**ORCID and institutional email:** not provided.

### Suggested citation

VELOSO, Romário J. O. *CMDB Guide — temporary configuration of Windows 7 security controls in a laboratory*. Recife: Federal University of Pernambuco, 2026. Version 0.1.0. Work in progress.

## Version history

| Version | Date | Responsible person | Change |
|---|---|---|---|
| 0.1.0 | 2026-09-01 | Romário J. O. Veloso | First editorial organization of the evidence produced in the laboratory. |

## Contents

1. [Purpose, scope, and audience](#1-purpose-scope-and-audience)
2. [Safety decision](#2-safety-decision)
3. [Prerequisites and initial record](#3-prerequisites-and-initial-record)
4. [Temporary Windows Defender configuration](#4-temporary-windows-defender-configuration)
5. [Temporary Windows Firewall configuration](#5-temporary-windows-firewall-configuration)
6. [Confirmation, closure, and restoration](#6-confirmation-closure-and-restoration)
7. [Limitations](#7-limitations)
8. [Evidence checklist](#8-evidence-checklist)
9. [References](#9-references)
10. [Editorial validation](#10-editorial-validation)

## 1. Purpose, scope, and audience

This guide records the graphical procedure observed for temporarily disabling legacy Windows Defender and, when experimentally justified, the Windows Firewall profiles in a Windows 7 virtual machine.

It is intended exclusively for students and researchers in an authorized academic laboratory. It does not apply to personal, institutional, production, or real-network-connected computers. Disabling controls is not mandatory in every analysis: controls should remain enabled whenever they do not prevent the experimental question from being answered.

Windows Defender and Windows Firewall are separate controls. The former inspects potentially unwanted software according to the capabilities of that generation; the latter filters network traffic. Disabling one does not automatically disable the other.

## 2. Safety decision

Windows 7 support ended on 14 January 2020 [1]. Microsoft recommends leaving Windows Firewall enabled because disabling it removes filtering and other protections [2].

Before changing any control:

- obtain authorization and record the justification;
- use a disposable VM containing no personal data or credentials;
- create and test a clean snapshot;
- disable shared folders, clipboard sharing, drag-and-drop, and USB passthrough;
- disconnect the virtual interface from external networks **before** disabling the Firewall; and
- define how evidence will be removed without reconnecting the compromised VM.

If the experiment requires connectivity, keep the Firewall enabled and use specific rules or an approved simulation network. Disabling the Firewall does not create isolation.

## 3. Prerequisites and initial record

- Windows 7 VM dedicated to the laboratory;
- authorized administrative account;
- access to the hypervisor console;
- validated snapshot or restoration image; and
- form for recording settings, times, and responsible people.

Before making changes, record the Windows edition and Service Pack, virtual-interface state, Windows Defender state, each Firewall profile, snapshot identifier, date, operator, and objective. Screens vary by edition, language, policy, and installed software.

## 4. Temporary Windows Defender configuration

### 4.1 Open the program

From the **Start** menu, search for `Windows Defender` and open the corresponding result.

**Figure 1 — Opening Windows Defender from the Start menu**

![Windows 7 Start menu showing a search for Windows Defender](./img/01-open-windows-defender.png)

**Source:** Author's collection (2026).

### 4.2 Disable automatic scanning

Under **Tools > Options > Automatic scanning**, clear **Automatically scan my computer (recommended)**. Record its previous state.

**Figure 2 — Automatic scanning option cleared**

![Windows Defender options on the automatic scanning page](./img/02-disable-automatic-scan.png)

**Source:** Author's collection (2026).

### 4.3 Disable real-time protection

Under **Real-time protection**, clear **Use real-time protection (recommended)**. This change immediately increases the VM's exposure and must only occur after isolation has been confirmed.

**Figure 3 — Real-time protection cleared**

![Windows Defender options showing the real-time protection setting](./img/03-disable-real-time-protection.png)

**Source:** Author's collection (2026).

### 4.4 Review advanced options

Under **Advanced**, record the existing options. This page groups additional scanning behaviors; it does not independently confirm that the program was disabled. Do not change settings unrelated to the experimental plan.

**Figure 4 — Advanced options observed in Windows Defender**

![Windows Defender advanced options page showing additional scanning items](./img/04-review-advanced-options.png)

**Source:** Author's collection (2026).

### 4.5 Disable use of the program

Under **Administrator**, clear **Use this program**, and select **Save**. This action requires administrative privileges and disables legacy Windows Defender in this installation.

**Figure 5 — Use this program option cleared**

![Windows Defender Administrator page with Use this program cleared](./img/05-disable-use-program.png)

**Source:** Author's collection (2026).

Confirm the displayed message and close the window. The confirmation is evidence of the state shown by the interface, not proof of isolation or the absence of other security software.

**Figure 6 — Visual confirmation that Windows Defender was disabled**

![Windows Defender message stating that the program was disabled](./img/06-defender-disabled-confirmation.png)

**Source:** Author's collection (2026).

## 5. Temporary Windows Firewall configuration

This step is optional and requires separate justification. Confirm in the **hypervisor** that the virtual interface is disconnected from external networks before proceeding.

### 5.1 Open profile settings

Under **Control Panel > System and Security > Windows Firewall**, select **Turn Windows Firewall on or off**.

**Figure 7 — Opening Firewall profile settings**

![Windows Firewall panel showing the link for turning the control on or off](./img/07-open-firewall-settings.png)

**Source:** Author's collection (2026).

### 5.2 Temporarily disable profiles

Select **Turn off Windows Firewall (not recommended)** for the profiles included in the experiment and confirm with **OK**. In the capture, the option was selected for the home/work and public profiles.

**Figure 8 — Home/work and public profiles configured as disabled**

![Windows Firewall settings showing the disabled option selected for both profiles](./img/08-disable-firewall-profiles.png)

**Source:** Author's collection (2026).

Do not stop the Firewall service. Microsoft documentation warns that stopping the service can cause incompatible behavior [2].

## 6. Confirmation, closure, and restoration

Before the experiment, record automatic scanning, real-time protection, Windows Defender program-use status, every Firewall profile, virtual-interface state, host–guest integrations, and the snapshot. Do not connect the VM to the internet to allow sample communication.

After collecting evidence, keep the VM disconnected. The preferred closure is to shut it down and restore the clean snapshot or discard it. Re-enabling controls in a system that executed malware does not establish that it has become trustworthy again.

If laboratory policy requires reusing the image, while it remains disconnected from external networks:

1. re-enable **Use this program**, real-time protection, and automatic scanning;
2. re-enable Windows Firewall for every profile;
3. restart and record the controls' status;
4. perform the checks defined by the laboratory; and
5. reconnect the interface only after formal validation.

## 7. Limitations

- The captures represent one Windows 7 installation.
- Legacy Windows Defender is not equivalent to current Microsoft Defender Antivirus.
- Interface status does not establish the state of every service or third-party solution.
- Disabling the Firewall removes local filtering but neither creates nor proves isolation.
- Restoring controls does not eliminate malware persistence or tampering.

## 8. Evidence checklist

- [ ] Authorization and objective recorded.
- [ ] Windows version and VM configuration recorded.
- [ ] Clean snapshot identified and tested.
- [ ] Hypervisor network and integrations checked.
- [ ] Previous state of each control preserved.
- [ ] Changes and timestamps recorded.
- [ ] Evidence removed through an approved procedure.
- [ ] VM restored or discarded and responsible operator recorded.

## 9. References

1. MICROSOFT. *FAQ about the end of support for Windows 7*. Microsoft Learn. Available at: <https://learn.microsoft.com/en-us/troubleshoot/windows-client/windows-7-eos-faq/windows-7-end-support-faq-general>. Accessed: 1 Sept. 2026.
2. MICROSOFT. *Windows Firewall overview*. Microsoft Learn. Available at: <https://learn.microsoft.com/windows/security/operating-system-security/network-security/windows-firewall/>. Accessed: 1 Sept. 2026.

## 10. Editorial validation

| Role | Name | Date | Validated version |
|---|---|---|---|
| Author | Romário J. O. Veloso | Pending | Pending |
| Technical reviewer | Pending | Pending | Pending |
| Editorial/institutional approval | Pending | Pending | Pending |

