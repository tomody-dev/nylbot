# GitHub Actions input handling guidelines

Rules for writing `description` fields for inputs in GitHub Actions to ensure clarity, consistency, and quick recognition of input status. When adding or changing Action inputs, follow this document.

## Mandatory & Permanent Rules

Apply to **all inputs without exception** and must be followed permanently.

> [!IMPORTANT]
>
> Prefixes `DEPRECATED: ` and `OPTIONAL: ` in `description` are **mandatory and permanent** for clarity and consistency.

### 1. `DEPRECATED: ` Prefix

- **Rule:**
  - Add `DEPRECATED: ` (including one trailing space) at the beginning of `description` for all deprecated inputs.
  - Do not prepend `OPTIONAL: ` redundantly.
- **Purpose:**
  - Indicate non-recommended usage at first glance, regardless of runtime warnings.

### 2. `OPTIONAL: ` Prefix

- **Rule:**
  - Add `OPTIONAL: ` (including one trailing space) at the beginning of `description` for all inputs where `required: false`.
  - Do not apply this prefix to deprecated inputs.
- **Purpose:**
  - Make it immediately clear that the input is optional, even outside the YAML context.

#### Example:

```yaml
# Optional input
description: "OPTIONAL: Path to the file"
required: false

# Deprecated input
description: "DEPRECATED: Old configuration option"
required: false
deprecationMessage: "'old_option' is deprecated and will be removed in a future release."
```

## Temporary and emergency measures (Quick Fix)

Provide quick mechanical steps for urgent situations when detailed consideration is not possible.

> [!NOTE]
>
> Use these steps only when there is no time for detailed review.
> They are **not mandatory** and can be replaced by better wording if time allows.

### Quick Conversion Template:

```yaml
## Prefix with `DEPRECATED: ` for deprecated inputs
description: 'DEPRECATED: {{old-description}}'
## `required` is always `false` for deprecated inputs
required: false
## Remove `default` to avoid implicit usage
# default:  // removed
## Simple warning without migration details
deprecationMessage: "'{{input_id}}' is deprecated and will be removed in a future release."
```
