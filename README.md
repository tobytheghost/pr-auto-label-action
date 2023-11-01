# PR Auto Label Action

A GitHub Action for labelling Pull Requests

## Usage

Add the following GitHub workflow to your repository.

```yaml
name: PR Auto Label Action
on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize
      - labeled
      - unlabeled
jobs:
  pr-auto-label-action:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
    steps:
      - uses: tobytheghost/pr-auto-label-action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          IGNORED_FILES:
            - "file-to-ignore.js"
```

## Labels

### Size

The following labels will be put on your Pull Requests depending on the size of them:

| Label    | # of changed lines |
|----------|--------------------|
| size/XS  | 1 - 50             |
| size/S   | 51 - 100           |
| size/M   | 101 - 250          |
| size/L   | 251 - 500          |
| size/XL  | 501 - 1000         |
| size/XXL | 1001+              |

