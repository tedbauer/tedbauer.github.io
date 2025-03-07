---
template: post.html
---

# [`up`](https://github.com/tedbauer/homebrew-up): jump multiple directory levels quickly

## Introduction

Recently in my day to day, I have been `cd`ing around deeply nested directories, and I have been finding myself often typing `cd ..` repeatedly. I often find myself wishing I can just quickly jump up a few directory levels from the current working directory in a quick and natural way. I was also curious to learn about how tab autocomplete is implemented in the shell, so I was inspired to make a tool to enable this.

Here is a short demo of `up` in action:

[![asciicast](https://asciinema.org/a/fdSxD29IhP6LmXuGQpbm27sNf.svg)](https://asciinema.org/a/fdSxD29IhP6LmXuGQpbm27sNf)

You can type `up d`, where `d` is either a directory above you, or a prefix of a directory above you, and you will be `cd`'d up to that directory.

## Implementing autocomplete for bash

Bash provides a mechanism for user-created autocompletion with the [`complete`](https://linuxcommand.org/lc3_man_pages/completeh.html) command. You pass it the name of the command you want to support autocomplete for, and then the name of a function that dynamically generates the set of possible autocompletes, based on the current user input:

```
up_completion() {
    completions=$($BINARY_PATH --complete $COMP_CWORD $COMP_LINE)
    COMPREPLY=($completions)
}

complete -F up_completion up
```

Here, we get the user input from `$COMP_CWORD` (an index into a space-separated list of input words) and `$COMP_LINE` (the entire user input line) and pass them to a Rust binary that computes the possible autocompletes. Setting `$COMPREPLY` supplies the autocomplete options to the user.

In the Rust binary, we get the current working directory, determine each directory name, and then return a list of directory names that contain the input as a prefix:

```
fn generate_completion_options(working_dir: &str, comp_line: &str, comp_cword: usize) -> Vec<String> {
    // If there is already a whole argument, don't suggest more autocompletes.
    if comp_cword > 1 {
        return vec![];
    }

    let directories = working_dir
        .split('/')
        .map(|s| String::from(s))
        .collect::<Vec<String>>();

    let user_input = match comp_line.split(" ").nth(1) {
        Some(arg) => arg,

        // If there is no input yet, list all directories.
        None => return directories,
    };

    let mut result = Vec::new();
    for (_, directory) in directories.iter().enumerate() {
        if directory.starts_with(user_input) {
            result.push(directory.to_string());
        }
    }

    if result.is_empty() {
        directories
    } else {
        result
    }
}
```

## Other similar things

There are lots of other useful and creative tools for navigating directories quickly:

- fuzzy finders, like [`fzf`](https://github.com/junegunn/fzf)
- [`z`](https://github.com/rupa/z)
- [`cdargs`](https://linux.die.net/man/1/cdargs), [`pushd`](https://linuxcommand.org/lc3_man_pages/pushdh.html) / [`popd`](https://linuxcommand.org/lc3_man_pages/popdh.html)

In the Android repository, there is an [environment setup script](https://cs.android.com/android/platform/superproject/main/+/main:build/make/envsetup.sh) that sets up an alias, [`croot`](https://cs.android.com/android/_/android/platform/build/+/db666bcb0ce5934f75664076306a5912c0aa89b7:envsetup.sh;l=1044;bpv=1;bpt=0), that `cd`'s you to the root of the project.

## Try it out

Try it out by installing it with Homebrew:

```
brew tap tedbauer/homebrew-up
brew install tedbauer/homebrew-up/up
```

Alternatively, you can install it manually. You can clone the repo:

```
git clone https://github.com/tedbauer/homebrew-up
```

The installation comprises of two main things:

- `up-path-gen`: a Rust binary that computes the paths.
- `up.sh`: contains a function `up`, which is what the user ends up invoking. It invokes `up-path-gen`.

You can build the binary, and install it somewhere like `/usr/lib`, and similarly install `up.sh` as well:

```
cd Formula/up-path-gen && cargo build --release
cp target/release/up-path-gen /usr/lib
cd ..
cp up.sh /usr/lib
```

Then, source `up.sh` in your shell configuration:

```
export BINARY_PATH="/usr/lib/up-path-gen"
source /usr/lib/up.sh
```
