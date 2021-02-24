# Miscellaneous Utility Scripts for Substrate Devhub

## Installation

```bash
# After git clone the repository
yarn install
cp .env.example .env
# Generate your github personal access token and put them in .env as followed,
#   notice no space in each line.
# Generate your access token at: https://github.com/settings/tokens
#
#   GH_USERNAME=your-github-username
#   GH_ACCESS_TOKEN=your-github-access-token
```

## Cmd: `find-exe`

Stands for find and execute. It mainly has two purposes:

1. To search for a certain regex string within a certain path (all files and its subdirectories), and replace with another string if specified.

2. To extract out all URLs from a certain path (all files and its subdirectories) , either just display them out, or visit them and report back links status.

### Regex Replacement

- To search for the string `v2.0.0` in all md files, case insensitive (`-i`). We need to escape `.` with `\` because this parameter will be processed as a regular expression. We also need to single-quote the path so that `*` is not expanded by the shell.

  ```
  ./find-exe find 'v2\.0\.0' -i '/devhub-maindocs/docs/**/*.md'
  ```

- To search for the string `v2.0.0` in all md files, case insensitive, and replace the matched strings with `v3.0.0`. `-d` means dry-run, and will display what lines are changed and what these lines end up look like.

  ```
  ./find-exe find 'v2\.0\.0' -id -r 'v3.0.0' '/Users/jimmychu/src/parity/devhub-gh/maindocs/docs/**/*.md'
  ```

- To search for the string `v2.0.0` in all md files, case insensitive, and replace the matched strings with `v3.0.0`. The replacement will be done in-place in the file. **Please commit your files or backup your whole directory before running this command.**

  ```
  ./find-exe find 'v2\.0\.0' -ir 'v3.0.0' '/Users/jimmychu/src/parity/devhub-gh/maindocs/docs/**/*.md'
  ```

### URL Checking

- To display all URLs found in the path (all files and its subdirectories). URLs are assumed to start with either `http://`, `https://`, `ftp://`, or `file://`.

  ```
  ./find-exe url '/Users/jimmychu/src/parity/devhub-gh/maindocs/docs/**/*.md'
  ```

- To display all URLs found in the path, try to visit them, and report status.

  ```
  ./find-exe url -v '/Users/jimmychu/src/parity/devhub-gh/maindocs/docs/**/*.md'
  ```

- To display all URLs found in the path, try to visit them, and report status only to links that returned error (non 200 status).

  ```
  ./find-exe url -ve '/Users/jimmychu/src/parity/devhub-gh/maindocs/docs/**/*.md'
  ```

### Getting Help

```
$ ./find-exe --help      # showing help for the top level command

Usage: find-exe [options] [command]

Options:
  -V, --version                       output the version number
  -h, --help                          display help for command

Commands:
  find [options] <find-regex> <path>  finding lines that fit the specified regex in path
  url [options] <path>                finding all URLs in path
  help [command]                      display help for command

$ ./find-exe find --help # showing help for `find` subcommand

Usage: find-exe find <find-regex> [options] <path>

finding lines that fit the specified regex in path

Options:
  -i, --insensitive         regex to be matched with case-insensitive (default: false)
  -d, --dry-run             use with replace flag, output the changes on display and no files are overwritten (default: false)
  -r, --replace <repl-str>  replace the matched strings with `repl-str` to files in-place
  -h, --help                display help for command

$ ./find-exe url --help  # showing help for `url` subcommand

Usage: find-exe url [options] <path>

finding all URLs in path

Options:
  -v, --visit       attempt to visit each link found and report back (default: false)
  -e, --error-only  use with visit flag, only display URLs returning non-200 status code (default: false)
  -h, --help        display help for command
```

## Cmd: `get-gh-metrics`

TODO
