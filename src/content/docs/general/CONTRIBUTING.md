# Contributing to Caatinga Malware DB

**English** | [Português (Brasil)](./CONTRIBUTING.pt-BR.md)

Thank you for helping build a reliable academic resource. Because this repository may contain live malware, contributions are reviewed for research value, safety, provenance, privacy, and legal risk—not only technical correctness.

By participating, you agree to follow the [disclaimer](./DISCLAIMER.md), [licensing scope](./LICENSE.md), and [security policy](./SECURITY.md).

## Ways to contribute

- Correct or translate project documentation.
- Improve analysis, indicators of compromise, detection guidance, or remediation notes.
- Add reproducible static-analysis results that do not require executing a sample.
- Propose a new sample through the controlled intake process below.
- Report inaccurate, unsafe, sensitive, or improperly licensed material.

## Never submit through a public issue

Do not attach or paste any of the following into an issue, discussion, comment, or unapproved pull request:

- unpacked executables, scripts, payloads, shellcode, or malicious documents;
- passwords, tokens, personal data, victim data, or confidential information;
- live command-and-control addresses or infrastructure that could continue an attack; or
- material obtained without authorization or whose redistribution would violate law, contract, or third-party rights.

For a sensitive safety, privacy, copyright, or abuse concern, follow [SECURITY.md](./SECURITY.md).

## Documentation contributions

1. Open an issue or pull request that explains the academic or defensive value of the change.
2. Cite reliable primary sources where possible. Clearly distinguish observed results from external claims and hypotheses.
3. Remove personal, victim, credential, and unrelated confidential data from text, screenshots, logs, memory dumps, and packet captures.
4. Preserve the English/Portuguese navigation and update both language versions when changing project-level policy or navigation.
5. Do not include instructions whose principal effect is deployment, persistence, evasion, credential theft, unauthorized access, or harm. Explain offensive behavior only to the level necessary for analysis, detection, containment, or remediation.

## Controlled sample intake

Do **not** begin by uploading a sample. First open a proposal containing only non-sensitive metadata, or contact the maintainers privately when even the metadata is sensitive. The proposal must include:

- malware family or best available classification;
- file type, target platform, architecture, and approximate size;
- acquisition source, acquisition date, chain of custody, and redistribution basis;
- links to public threat reports or analysis, when available;
- expected academic or defensive value;
- known destructive, self-propagating, anti-analysis, persistence, or network behavior; and
- confirmation that the material contains no victim data, credentials, personal data, or confidential third-party information.

A maintainer must approve the intake **before** any binary is added. Approval to discuss a sample is not approval to publish it.

### Packaging requirements after approval

- Never commit an unpacked live sample.
- Place each sample in an encrypted archive using the project's documented password convention (`infected`). This conventional password is an accidental-execution safeguard, not access control.
- Verify that encryption is actually enabled; a `.zip` extension alone provides no protection.
- Use consistent filenames and clearly identify each documented artifact.
- Add a research report with classification, provenance, SHA-256 for the package and each extracted artifact, technical observations, indicators, containment or remediation information, and references.
- Keep recovery tools and benign third-party utilities separate from malicious samples and document their upstream source and license.

Maintainers may require a different transfer mechanism, additional institutional review, or rejection/removal of an artifact.

## Content that will not be accepted

- Material intended to support an ongoing unlawful attack or active malware campaign.
- Turnkey deployment, phishing, credential theft, persistence, destructive, or command-and-control infrastructure.
- Samples containing real credentials, personal data, victim identifiers, proprietary data, or secrets.
- Content with unverifiable provenance or no defensible redistribution basis.
- Contributions that add dangerous capability without clear educational or defensive analysis.
- Password-protected archives whose contents were not disclosed to and reviewed by maintainers.

## Pull request checklist

- [ ] I explained the educational or defensive value of the contribution.
- [ ] I clearly identified each analyzed artifact.
- [ ] I documented provenance and my basis for submitting the material.
- [ ] I removed secrets, personal data, victim data, and unrelated confidential information.
- [ ] I did not place an unpacked sample or binary in a public issue.
- [ ] I updated relevant English and Portuguese project documentation.
- [ ] I accept the applicable terms in [LICENSE.md](./LICENSE.md).
- [ ] My commits include a `Signed-off-by` line as described below.

## Developer Certificate of Origin

Contributors certify that they have the right to submit their contribution under the project's applicable license by signing off each commit in accordance with the [Developer Certificate of Origin 1.1](https://developercertificate.org/):

```bash
git commit --signoff
```

The sign-off records the contributor's real name and email in the commit message. It is not a statement that the contributor owns third-party malware; provenance and a lawful redistribution basis must still be documented separately.

## Review and removal

Maintainers may reject, quarantine, restrict, or remove any contribution to protect users, comply with GitHub policy or applicable law, respond to an abuse or rights-holder report, or preserve the project's academic and defensive purpose.
