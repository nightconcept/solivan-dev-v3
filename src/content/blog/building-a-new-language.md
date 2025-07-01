---
title: Building a New Language
date: 2025-06-30T14:16:56-07:00
lastmod: 2025-06-30T14:16:56-07:00
author: ['Danny']
categories:
  - blog
tags:
  - dev
description: ''
weight: 
slug: "building-a-new-language"
draft: false
cover:
  image: ''
  caption: ''
  alt: ''
  relative: false
---

# Building a New Language


## Preamble

And here, I mean a programming language. I have always had a fascination of programming languages. When I was a wee lad, I thought I would just learn all of them. I wanted to start with HTML, moved on to CSS, JS, C, C++, Assembly... Well that didn't happen. I burnt out building table-based websites in HTML/CSS during middle school and simply did not have the mental capacity in high school due to hormones. I enrolled in an electrical engineering program and I was *required* to learn Java.

Java was pretty mid. There is way too much confusing boilerplate. Big Java, my CS111 textbook at Oregon State, was just too big (no offense to [Professor Horstmann](https://horstmann.com/), reading his blog is pretty cool now). Eclipse was slow. The whole experience was just awful! Look at this confusing hello world!

```java
class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!"); 
    }
}
```

I looked this up in 2025 and I think it hasn't changed. Nevertheless, there's way too many keywords. I made it through those courses and moved on to... C by sophomore year. It was a little bit better. I don't remember the IDE we used at the time, but it wasn't Eclipse, so it was automatically better. Here's a basic hello world in C:

```c
#include <stdio.h>

int main() {

  printf("Hello, World!");
  return 0;
}
```

Visually, it's less confusing at first glance. The lack of "width" made it much easier to parse. I was also already armed with knowledge of primitives. At the time, I didn't really understand Java's keywords (mostly `static` and `class`) that well so it made me still wonder "why does this work?" C just seemed to make more sense. It made less sense to me that C was older than Java. I thought technology was supposed to improve over time? I'm sorry for bashing on you so much Java. I know you have a place in the world in enterprise tech and that you're just not for me.

Junior year, we were introduced to our first formal scripting languages, Bash and Python, for our operating systems course.

```bash
#!/bin/bash

echo "Hello, World!"
```

```python

print("Hello, World!")
```

Now, I understand why the she-bang is there in Bash, but it seems like extra noise to me. It is nice though that I don't have to compile. I'm still a fresh 19 year-old and still ignorant of how compilers (or makefiles) really work, so coming from C, it's nice I just run the script without a compile step.

But, oh. *How you doin, Python?* This is pefection. It's simple and completely understandable at a glance. You could almost teach a child this. There's nothing to distract them. It's just magical.

*Note: Python 3 was released around the time I was learning it, so the parenthesis were just being added and I can't find/remember whether I actually used 2.x or 3.x in school. For now, I am retconning my schooling such that I did indeed use parenthesis with print.*

Fast forward a few years and little Python until 2020 when I get my first project to use it. It's still beautiful to me. No curly brackets invading the visual space. The styling and vibes are just very nice and clean. Virtual environments? I haven't used them before. They're great! I don't want to pollute my global development space like `npm` (I had some minor encounters with web dev by then). What's this? `poetry`? It now manages my packages, my project, and venv for me? WONDERFUL! Wait, no... why isn't my venv working? Bah, delete it, and sync it. Ugh wrong Python on the PC? Well, let's use `pyenv`(-win) to manage multiple versions. Problem solved!

Ugh, I reformatted again. I have to set up `pyenv`, `poetry`, and Python again... Oh, I found `uv` can manage my Python installs! Wait, why do I have so many tools bolted on together? Do `uv` and `poetry` play nice? How should I be installing packages now? This is just terrible developer experience (DX). I'm done.

*Dramatic pause.*

In 2025, I discovered coding agents and how I could use them. I cycle through over the span of 3 months using Elixir (still grasping it, but I love the concepts from functional programming and "Let it fail" threading), Gleam (might as well get types with my Elixir-like?) many JS frameworks (Svelte, React, Astro), Lua (for Love2D since Balatro is great), Go (wow such simple like Lua), Rust (still scared), and C# (let's make games). I fully understand I'm not coding here. I'm not "learning" them deeply, but I am learning something. Using coding agents to make what I think of helps me tie the syntax with doing a specific action. I never would have been able to do that before. I learned that I truly loved **building** things just like I did when I was a kid with Legos.

Now, I've build a dozen throwaway projects and some even smaller tests. [NightEngine](https://github.com/nightconcept/NightEngine/) is my biggest project so far and I do expect to continue it. From it, I learned I love specifically building tools. I do have a game idea, but game design doesn't get my brain going like designing a tool others can use. (Designing a tool for others also deathly scares me since I never really know how well it will be received.) What's something else I can build? Wait, I love programming languages. What about a programming language? I did start reading Robert Nystrom's [Crafting Interpreters](https://craftinginterpreters.com/) a few months ago, what if I picked that up again?

## Boba

Finally, we're here. I am building the Boba programming language. Boba is intended to focus on these three pillars:
- Human and AI collaboration-focused design
- Unified and simple tooling
- Easy-to-learn build up to high productivity

What do each of these mean?

### Human and AI collaboration-focused design.

We are in the age of AI, or maybe agents? Doesn't matter. The genie is out of the bottle. Whatever that genie does, it's powered by LLMs. LLMs will be generating a LOT of code in the future whether it's a good or bad idea. I've heard developers are being replaced by AI. I've heard that developers will come out on top at the end of the day. Who knows? It's most likely somewhere in the middle. Developers will work with AI as their copilot. Sometimes, that's just code completion. Sometimes it's "vibe" coding an entire [project](https://neilmadden.blog/2025/06/06/a-look-at-cloudflares-ai-coded-oauth-library/). It changes day to day probably. That's fine. Ok, so we're stuck with AI, now what?

When you are having AI code something and it just doesn't work, there could be multiple reasons it failed. Maybe it forgot to `free()` in C. Maybe it forgot what type of variable `number` is because it's actually a string. How do we get the LLM onto rails that help it accomplish what we ask it to do? By making something friendlier for it. We should build a friendlier language.

What features should an AI-focused language have?
- Type safety. We can detect what would be run-time errors at compile time. Those errors should be fed back quickly into the LLM to fix the issue. This means...
- Good compiler errors. They should be descriptive enough for an LLM to fix it on the next turn.
- Statically typed. Static typing will reduce the amount of errors either through compile errors or even LSP reported errors.
- Garbage collected. Memory management is another "AI-attack-surface." Removing the ability to make a mistake with memory management means the program being vibe coded is more likely to be successful.
- Explicit and clear code with no hidden flow control. The LLM reading/writing code should be WYSIWIG. The LLM will not necessarily "know" what happens when you run the code. Everything visible must be all that happens.
- Familiar. I haven't been able to find training datasets correlated with LLMs and how many LOC (a bad measure, but a measure) for each programming language each LLM read, so we can use [this GitHub article](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)'s chart as a proxy. In 2024, the top 5 GH languages are: Python, Javascript, TypeScript, Java, and C#. We can intuit there's some truth to that given this [unsophisticated experiment](https://ben.terhech.de/posts/2025-01-31-llms-vs-programming-languages.html) to measure success rates. [TIOBE](https://www.tiobe.com/tiobe-index/) lists the top 5 as: Python, C++, C, Java, and C# . What is my point here? C-style languages make up the largest amount of the programming languages. All of those languages sit in the C-style family of languages, except Python. *However* Python is much closer in syntax than the other families like Lisp and COBOL. That said, the syntax should be C-like in nature.

Well, if we have LLMs writing a lot of code, we also need humans in the loop to verify it right? **Absolutely**. We need both an LLM and human ergonomic language. So what features need to be human centric?
- Familiar syntax. The above familiarity reasoning applies to humans as well.
- Simple syntax. Cognitive load should be low. Less keywords to remember is better. Less uncommon keywords is also better for humans. We can however spare some keywords to reduce other complexities and reduce code that needs to be written.

### Unified and Simple Tooling

For reasons from above, the Python ecosystem frustrates me to no other. `uv` has tried to simplify it and I am sure it can be simple, but it just never clicked with me. That said `go`'s ecosystem just makes sense. So much is baked into `go`. `run`, `build`, `test`, `fmt`, `get`... Same with `deno`. Of course, these tools were built knowing that it's predecessors had disparate ecosystems of tools. The same lesson applies here. All of the tooling in Boba will sit inside `boba`. There's no fragmentation here. It's built in to the tool.

On the flip side, I understand this makes the tool more monolithic, but this trade-off supports our other two pillars.

### Easy-to-learn Build Up to High Productivity

Maybe not the best title, but anyways this language should be easy to learn and easy to become productive. If you've been programming for a while, overcoming that initial hurdle is always the most tedious part.

Ok, so now that we have our pillars let's *finally* look at the language.

## Boba Syntax

```boba
print("Hello, World!")
```

KACHOW! That's it! Show's over! Just kidding. Here's much, much more!

```boba
// ===================================================================
//
//  BOBA SHOWCASE PROJECT: INVENTORY MANAGER
//
//  This file demonstrates a wide range of Boba's features in a
//  single, cohesive project.
//
//  PROJECT STRUCTURE:
//  .
//  ├── src/
//  │   ├── inventory_manager.boba      (Main module logic)
//  │   └── inventory_manager_test.boba (Unit tests for the module)
//  └── tests/
//      └── public_api_test.boba      (Integration tests)
//
// ===================================================================


// ===================================================================
//  FILE: src/inventory_manager.boba
// ===================================================================

//! A module for managing a player's inventory, including adding,
//! removing, and querying items. This demonstrates core data
//! structures, error handling, and idiomatic Boba style.

// --- Type Definitions ---

// Naming: `PascalCase` for enums.
/// Represents the categories an item can belong to.
pub enum ItemCategory {
    WEAPON,
    ARMOR,
    POTION,
}

// Naming: `PascalCase` for structs.
/// Represents a single item in the game world.
pub struct Item {
    /// The unique ID for this item.
    pub id: int,
    /// The display name of the item.
    pub name: string,
    /// The category the item belongs to.
    pub category: ItemCategory,
}

// A custom error type for our module.
pub struct InventoryError {
    pub code: string,
    pub message: string,
}

/// Manages a collection of items for a player.
pub struct PlayerInventory {
    // This field is private. Access is controlled by methods.
    items: map<int, Item>,
    // Another private field.
    max_size: int,
}


// --- Implementation Block ---

// Organization: `impl` block for the public `PlayerInventory` type.
impl PlayerInventory {
    /// Creates a new, empty inventory with a specified maximum size.
    /// This is the idiomatic constructor pattern.
    ///
    /// @param max_size: The maximum number of items the inventory can hold.
    /// @returns: A new `PlayerInventory` instance.
    pub fn new(max_size: int) -> PlayerInventory {
        return PlayerInventory{
            items: {}, // An empty map literal
            max_size: max_size,
        }
    }

    /// Adds an item to the inventory.
    /// Demonstrates returning a `Result` for recoverable errors.
    ///
    /// @param item: The `Item` to add.
    /// @returns: An empty `Ok` on success, or an `Err(InventoryError)` if
    ///           the inventory is full.
    pub fn add_item(mut self, item: Item) -> Result<(), InventoryError> {
        if self.items.len() >= self.max_size {
            // Return an error if the inventory is full.
            return Err(InventoryError{
                code: "INVENTORY_FULL",
                message: "Cannot add item; inventory is at maximum capacity.",
            })
        }
        self.items[item.id] = item
        return Ok(())
    }

    /// Retrieves an item by its ID.
    /// Demonstrates returning an `Option` for values that may be absent.
    pub fn get_item(self, item_id: int) -> Option<Item> {
        // Map access in Boba safely returns an Option.
        return self.items[item_id]
    }

    /// Returns the total number of items in the inventory.
    pub fn item_count(self) -> int {
        return self.items.len()
    }

    /// A private helper function to format a status line.
    /// It is not marked `pub`, so it's only visible within this file.
    fn format_status_line(self) -> string {
        // F-string formatting
        return f"Inventory Status: {self.item_count()} / {self.max_size} items."
    }

    /// Prints a formatted report of the inventory's status.
    /// Demonstrates the pipe operator `|>` for a clear data flow.
    pub fn print_report(self) {
        self.format_status_line()
            |> self.add_header_and_footer()
            |> print()
    }

    // Another private helper, demonstrating a function with a default parameter.
    fn add_header_and_footer(self, text: string, border_char: string = "=") -> string {
        let border = border_char.repeat(text.len())
        return f"{border}\n{text}\n{border}"
    }
}


// ===================================================================
//  FILE: src/inventory_manager_test.boba
// ===================================================================

#[file: test] // Designates this as the unit test file for `inventory_manager.boba`

//! Unit tests for the PlayerInventory module.
//! This file has special access to the private items of its corresponding
//! implementation file because of the `#[file: test]` attribute.

// Imports are still needed for types from the module under test.
import { PlayerInventory, Item, ItemCategory } from "./inventory_manager.boba"

#[test]
fn test_new_inventory_is_empty() {
    let inventory = PlayerInventory.new(max_size: 5)
    test.assert_eq(inventory.item_count(), 0)
}

#[test]
fn test_add_item_succeeds() {
    var inventory = PlayerInventory.new(max_size: 5)
    let sword = Item{ id: 1, name: "Steel Sword", category: ItemCategory.WEAPON }

    // The `?` operator can be used in tests to unwrap a `Result`.
    // If add_item returns an `Err`, the test will panic and fail.
    inventory.add_item(sword)?

    test.assert_eq(inventory.item_count(), 1)

    // Using `??` to provide a default for an `Option`.
    let default_item = Item{ id: 0, name: "Fist", category: ItemCategory.WEAPON }
    let retrieved = inventory.get_item(1) ?? default_item

    test.assert_eq(retrieved.name, "Steel Sword")
}

#[test]
fn test_add_item_fails_when_full() {
    var inventory = PlayerInventory.new(max_size: 1)
    inventory.add_item(Item{ id: 1, name: "Item 1", category: ItemCategory.POTION })?

    // Try to add another item to the full inventory.
    let result = inventory.add_item(Item{ id: 2, name: "Item 2", category: ItemCategory.POTION })

    // Use `match` to assert that we got the specific error we expected.
    match result {
        Ok(_) => panic("Adding to a full inventory should have failed!"),
        Err(e) => test.assert_eq(e.code, "INVENTORY_FULL"),
    }
}

#[test]
fn test_private_format_status_line() {
    // This is allowed ONLY because of `#[file: test]`.
    // We are directly calling a private method for focused unit testing.
    let inventory = PlayerInventory.new(max_size: 10)
    let status = inventory.format_status_line()
    test.assert_eq(status, "Inventory Status: 0 / 10 items.")
}

#[test]
#[should_panic]
fn test_accessing_non_existent_item_with_unwrap_panics() {
    let inventory = PlayerInventory.new(max_size: 5)
    // This demonstrates a common pattern that can cause panics.
    // .get_item() returns an Option. If we force-unwrap it when it's
    // None, the program will panic. This test verifies that behavior.
    inventory.get_item(99).unwrap() // Assuming `unwrap` is a standard library method that panics on None
}


// ===================================================================
//  FILE: tests/public_api_test.boba
// ===================================================================

//! Integration tests for the inventory manager's public API.
//! This file lives in the `tests/` directory and can only access
//! the `pub` items from the `inventory_manager` module.

// Imports use relative paths to access the `src` directory.
import { PlayerInventory, Item, ItemCategory } from "../src/inventory_manager.boba"

#[test]
fn test_full_inventory_lifecycle_from_external_view() {
    // 1. Create a new inventory.
    var inventory = PlayerInventory.new(max_size: 2)
    test.assert_eq(inventory.item_count(), 0)

    // 2. Add some items.
    let potion = Item{ id: 101, name: "Health Potion", category: ItemCategory.POTION }
    let helmet = Item{ id: 202, name: "Iron Helmet", category: ItemCategory.ARMOR }

    inventory.add_item(potion)?
    inventory.add_item(helmet)?
    test.assert_eq(inventory.item_count(), 2)

    // 3. Verify we can't add more.
    let shield = Item{ id: 303, name: "Wooden Shield", category: ItemCategory.ARMOR }
    let result = inventory.add_item(shield)
    test.assert(result.is_err(), "Should not be able to add to a full inventory.")

    // 4. Retrieve an item and check its properties.
    match inventory.get_item(202) {
        Some(item) => test.assert_eq(item.name, "Iron Helmet"),
        None => panic("Item 202 should have been found!"),
    }
}
```

All of that was AI generated knowing the syntax of Boba. I have manually verified that a few functions are are missing, but I won't fix it this time. My best take on the syntax of Boba is simpler Rust and a garbage collector. I think the comments and the syntax explain pretty well what it does, so for now I will not explain the syntax, but just let it sit. Who is going to read this anyway?