# AntiPetya recovery resource

**English** | [Português (Brasil)](./CMDB-AntiPetya-Resource-pt-BR.md)

> [!IMPORTANT]
> This document describes a third-party defensive utility kept in the Petya study directory. The file was not created by UFPE, CMDB, or its contributors and is not covered by the project's CC BY 4.0 or MIT licenses.

## Identification

| Field | Value |
|---|---|
| Upstream project | [`hasherezade/petya_key`](https://github.com/hasherezade/petya_key) |
| Release | [`0.2`](https://github.com/hasherezade/petya_key/releases/tag/0.2), published on July 26, 2017 |
| Official asset | [`antipetya_ultimate.iso`](https://github.com/hasherezade/petya_key/releases/download/0.2/antipetya_ultimate.iso) |
| Declared purpose | Bootable CD for recovering the individual key of supported Petya variants |
| File preserved by CMDB | `antipetya_ultimate-v0.2.zip` |
| ZIP password | `infected` |
| ISO size | `43,409,408 bytes` |
| ISO SHA-256 | `c5d76efe5b477aa41b1d6d186ab447394b591e22a47184a82f9cdfac522e185f` |
| CMDB ZIP SHA-256 | `ff0c75a25484e75950decbdf60dfa76c284734d12de387b52fc95091c13c146b` |

## Provenance verification

On August 26, 2026, the official release asset was obtained solely for static verification. Its size and SHA-256 matched the ISO contained in the CMDB ZIP. Neither file was executed during this verification.

The ISO hash identifies the content distributed upstream. The ZIP hash identifies only the current CMDB packaging and will change if the file is repackaged, even when the ISO remains identical.

## License and redistribution

At the time of verification, no explicit license was identified in the upstream repository or release. The release states that the tools are provided “as is” and used at the user's own risk, but that notice is not a redistribution license.

Accordingly, the presence of this file does not grant rights of use, modification, or redistribution beyond those established by the applicable rights holder or law. Before incorporation into the official branch, maintainers must confirm adequate redistribution permission or remove the ZIP and retain only the link to the official asset.

## Safety

The tool operates on disk structures and may cause data loss. The `infected` password reduces the risk of accidental package opening but does not make the content safe. Recovery should be evaluated by qualified personnel, against a disk copy and in an authorized environment, following the upstream project's guidance and disclaimers.
