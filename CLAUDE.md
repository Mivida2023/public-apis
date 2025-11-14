# CLAUDE.md - AI Assistant Guide for Public APIs Repository

This document provides comprehensive guidance for AI assistants working with the Public APIs repository. It outlines the codebase structure, development workflows, validation requirements, and key conventions that must be followed.

## Repository Overview

**Purpose**: A collective list of free APIs for use in software and web development, curated and maintained by the community.

**Main Branch**: `master`

**Primary File**: `README.md` - Contains a comprehensive, categorized table of public APIs

## Repository Structure

```
public-apis/
│
├── README.md                    # Main API catalog (190k+ lines)
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # MIT License
├── .github/
│   └── workflows/               # CI/CD automation
│       ├── test_of_push_and_pull.yml      # PR/Push validation
│       ├── validate_links.yml              # Daily link checks
│       └── test_of_validate_package.yml   # Package tests
│
└── scripts/                     # Validation and testing tools
    ├── README.md               # Scripts documentation
    ├── requirements.txt        # Python dependencies
    ├── github_pull_request.sh  # PR validation script
    │
    ├── validate/               # Validation package
    │   ├── format.py          # Format validation
    │   └── links.py           # Link validation
    │
    └── tests/                  # Unit tests
        ├── test_validate_format.py
        └── test_validate_links.py
```

## API Categories

The README.md is organized into 50+ categories, including:

- Animals, Anime, Anti-Malware
- Art & Design, Authentication & Authorization
- Blockchain, Books, Business
- Calendar, Cloud Storage & File Sharing
- Cryptocurrency, Currency Exchange
- Data Validation, Development, Dictionaries
- Email, Entertainment, Environment
- Finance, Food & Drink, Games & Comics
- Geocoding, Government, Health
- Jobs, Machine Learning, Music
- News, Open Data, Open Source Projects
- Photography, Programming, Science & Math
- Security, Shopping, Social
- Sports & Fitness, Test Data, Text Analysis
- Transportation, URL Shorteners, Vehicle
- Video, Weather

## Entry Format Requirements

### Table Structure

Each API entry follows this exact format:

```markdown
| API | Description | Auth | HTTPS | CORS | Call this API |
| --- | --- | --- | --- | --- | --- |
| [API Name](https://api-url.com) | Brief description | Auth-Type | Yes/No | Yes/No/Unknown | [Postman Button] |
```

### Field Specifications

#### 1. API (Title + Link)
- Format: `[API Name](https://documentation-url)`
- Must link to official API documentation
- **MUST NOT** end with " API" (e.g., ❌ "Gmail API" → ✔ "Gmail")
- **MUST NOT** include TLD in name (e.g., ❌ "Gmail.com" → ✔ "Gmail")

#### 2. Description
- **Maximum length**: 100 characters
- **Must** start with a capital letter
- **Must NOT** end with punctuation (except parentheses)
- Should be concise and informative

#### 3. Auth (Authentication)
- Valid values (must use backticks except for "No"):
  - `` `apiKey` `` - API requires a key/token
  - `` `OAuth` `` - OAuth authentication
  - `` `X-Mashape-Key` `` - Mashape header required
  - `` `User-Agent` `` - User-Agent header required
  - `No` - No authentication required

#### 4. HTTPS
- Valid values:
  - `Yes` - API supports HTTPS
  - `No` - API does not support HTTPS

#### 5. CORS
- Valid values:
  - `Yes` - API supports CORS
  - `No` - API does not support CORS
  - `Unknown` - CORS support is unknown

#### 6. Call this API (Optional)
- Link to Postman collection with "Run in Postman" button
- Format: `[<img src="..." alt="Run In Postman" ...>](postman-collection-url)`

### Spacing and Formatting

- Each table cell **MUST** have exactly **1 space** on either side of the pipe (`|`)
- Correct: `| API Name | Description | Auth |`
- Incorrect: `|API Name|Description|Auth|`

## Critical Rules for Adding/Modifying APIs

### 1. Alphabetical Order
- Entries within each category **MUST** be in alphabetical order (case-insensitive)
- Validation will fail if order is incorrect

### 2. Category Requirements
- Minimum **3 entries** per category
- Categories must be added to the Index section
- If an API fits multiple categories, place it in the most relevant one

### 3. Single API per Pull Request
- Add **only one API** per pull request
- Exception: Related updates to the same API

### 4. API Eligibility
- Must have **full free access** or at least a **free tier**
- Must NOT require purchase of device/service
- Must have **proper documentation**
- Must NOT be primarily a marketing attempt for paid services

### 5. No Duplicates
- Check for existing APIs before adding
- No duplicate URLs allowed across the entire README
- Script validates: `python scripts/validate/links.py README.md -odlc`

## Development Workflow

### Prerequisites

- Python 3.8+
- Dependencies: `python -m pip install -r scripts/requirements.txt`

### Before Submitting Changes

#### 1. Run Format Validation

```bash
python scripts/validate/format.py README.md
```

This validates:
- Alphabetical ordering within categories
- Entry format and structure
- Title, description, auth, HTTPS, CORS values
- Character limits and capitalization
- Spacing requirements
- Category minimum entries

#### 2. Run Link Validation

For quick duplicate check only:
```bash
python scripts/validate/links.py README.md -odlc
# or
python scripts/validate/links.py README.md --only_duplicate_links_checker
```

For full link validation (slow, checks if links work):
```bash
python scripts/validate/links.py README.md
```

#### 3. Run Unit Tests

```bash
cd scripts
python -m unittest discover tests/ --verbose
```

### Pull Request Guidelines

#### Title Format
- Use format: `Add {API-Name} API`
- Example: `Add Blockchain API`

#### Commit Message Format
- Be descriptive and specific
- ❌ Bad: `Update README.md`
- ✔ Good: `Add Blockchain API to Cryptocurrency`

#### Before Submitting
- Search previous PRs/issues to avoid duplicates
- Ensure all validation scripts pass
- Squash all commits into a single commit
- Target the `master` branch

#### PR Review Process
- Automated CI/CD will run:
  - Format validation
  - Link validation (duplicates only for PRs)
  - PR-specific diff validation
- **Ensure the build passes** (green checkmark)
- If build fails, check logs and fix errors

## CI/CD Workflows

### 1. Push & Pull Request Validation
- **Trigger**: Push to `master` or PR to `master`
- **Runs**:
  - Format validation
  - Pull request diff validation (PR only)
  - Duplicate link check (Push only)

### 2. Link Validation
- **Trigger**: Daily (cron: `0 0 * * *`) or manual workflow dispatch
- **Runs**: Full link validation checking if all URLs are working
- Takes significant time due to volume of links

## Validation Scripts Deep Dive

### format.py

Located at: `scripts/validate/format.py`

**Checks**:
- Alphabetical order within categories (lines 70-84)
- Title format `[TEXT](URL)` (lines 87-104)
- Title doesn't end with " API" (lines 98-102)
- Description capitalization (lines 111-114)
- Description max 100 chars (lines 121-124)
- Description no ending punctuation (lines 116-119)
- Auth value validity (lines 129-142)
- HTTPS value validity (lines 145-153)
- CORS value validity (lines 156-164)
- Column spacing (1 space padding) (lines 241-245)
- Minimum entries per category (lines 221-223)
- Category in index (lines 214-216)

**Exit codes**:
- 0: All validations passed
- 1: One or more validation errors

### links.py

Located at: `scripts/validate/links.py`

**Checks**:
- Duplicate URLs (lines 41-62)
- Links are accessible (lines 152-198)
- Handles Cloudflare protection (lines 95-149)
- Uses fake user agents to avoid blocks (lines 65-75)

**Exit codes**:
- 0: No duplicate or broken links
- 1: Duplicates or broken links found

## Common Pitfalls for AI Assistants

### ❌ Don't Do This:

1. Adding API names ending with " API"
   - Wrong: `[GitHub API](https://...)`
   - Right: `[GitHub](https://...)`

2. Including TLD in API names
   - Wrong: `[Gmail.com](https://...)`
   - Right: `[Gmail](https://...)`

3. Descriptions over 100 characters
   - Run validation to catch this

4. Incorrect spacing in table columns
   - Must be exactly 1 space on each side

5. Breaking alphabetical order
   - Always insert in correct alphabetical position

6. Using wrong Auth/HTTPS/CORS values
   - Stick to the allowed values only

7. Adding multiple APIs in one PR
   - One API per pull request

8. Forgetting backticks for Auth values
   - `No` doesn't need backticks
   - All others need backticks: `` `apiKey` ``

9. Descriptions ending with punctuation
   - Wrong: `Great API for developers.`
   - Right: `Great API for developers`

10. Not validating before committing
    - Always run format and link validation scripts

## Tips for AI Assistants

### When Adding a New API:

1. **Research first**: Verify API is free/freemium and has documentation
2. **Find the category**: Determine most appropriate category
3. **Check alphabetical position**: Find where it belongs in the category
4. **Format correctly**: Follow exact table format
5. **Validate locally**: Run both validation scripts
6. **Create focused PR**: Single API, clear title and commit message

### When Updating Existing API:

1. **Never replace with new version**: Old versions stay unless deprecated
2. **Maintain position**: Keep alphabetical order
3. **Preserve formatting**: Match existing style exactly

### When Reviewing README.md:

1. **Reading large file**: Use offset and limit parameters
   - `Read` tool with `offset` and `limit` for specific sections
   - `Grep` to search for specific patterns

2. **Finding categories**: Search for `^### ` pattern

3. **Checking specific API**: Use `Grep` with API name

## Testing Considerations

When working with this repository:

- Tests are in `scripts/tests/`
- Use Python unittest framework
- Run tests from `scripts/` directory
- Test coverage includes format and link validation

## Key Files to Reference

1. **CONTRIBUTING.md** - Detailed contribution guidelines
2. **scripts/README.md** - How to run validation scripts
3. **scripts/validate/format.py** - Format rules implementation
4. **scripts/validate/links.py** - Link validation implementation
5. **.github/workflows/** - CI/CD pipeline configuration

## Version Control

- **Main branch**: `master`
- **Squash commits**: Always squash before merging
- **Commit messages**: Descriptive, specific to changes
- **No force push**: Unless explicitly needed and approved

## Summary Checklist for AI Assistants

Before submitting any changes to README.md:

- [ ] Entry follows exact table format
- [ ] API name doesn't end with " API"
- [ ] API name doesn't include TLD
- [ ] Description ≤ 100 characters
- [ ] Description starts with capital letter
- [ ] Description doesn't end with punctuation
- [ ] Auth value is valid and properly formatted
- [ ] HTTPS value is Yes or No
- [ ] CORS value is Yes, No, or Unknown
- [ ] Entry is in alphabetical order within category
- [ ] Each column has exactly 1 space padding
- [ ] Ran `python scripts/validate/format.py README.md` successfully
- [ ] Ran `python scripts/validate/links.py README.md -odlc` successfully
- [ ] API has free access and proper documentation
- [ ] No duplicate URLs
- [ ] Single API per pull request
- [ ] Commit message is descriptive
- [ ] PR title follows `Add {API-Name} API` format

## Additional Resources

- **Repository**: https://github.com/public-apis/public-apis
- **API for this project**: https://github.com/davemachado/public-api
- **Discord**: Community discussions and support

## Last Updated

This document reflects the repository state as of the commit structure and conventions observed in November 2025. Always verify current guidelines in CONTRIBUTING.md for any updates.
