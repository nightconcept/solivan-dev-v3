---
title: AI Upskilling, Part 1 - Concepts
date: 2025-07-18T10:39:41-07:00
lastmod: 2025-07-18T10:39:41-07:00
author: ['Danny']
categories:
  - blog
tags:
  - lessons learned
description: ''
weight: 
slug: "ai-upskilling-part-1"
draft: true
cover:
  image: ''
  caption: ''
  alt: ''
  relative: false
---

## Introduction

AI is a field flooded with tons of developments, articles, speculation, and hot takes. In short order here are my hot takes, some much hotter than others:

- AI will bring jobs back to knowlege workers via augmentation.
- AI will disproportionately leave people behind.


The past few months I have dove pretty deeply into AI using it almost every hour of the day. I have learned quite a few things and I wanted to share this knowledge. I have been preparing a presentation to help my fellow software engineers at work skill up to begin using AI in the workplace. I have found most people are mainly using auto-completion and small self-contained scripts. I recently 

https://en.wikipedia.org/wiki/Capability_Maturity_Model

This guide is not intended to teach you the specifics, but give you just enough information to start using AI. There will be more parts soon which will give you more opinionated workflows that are currently viable. Things *will* change over time as the space evolves, but for the most part, all foundational concepts for application will be the same.

## Levels

Here are what I would call the levels of AI use:

- Level 0: Not using AI within daily workflow.
- Level 1: Using AI as a search replacement to get information concisely without having to synthesize multiple sources together.
- Level 2: Using AI to produce some sort of output beyond information such as a one-topic report, e-mail, or self-contained script of code.
- Level 3: Using AI **agents** to produce a more complex output than level 2 such as a multi-faceted report or a complex software application. (Note: More on agents later, but models create a large chasm between level 2 and level 3.)
- Level 4: Using multiple AI agents running concurrently to produce a variety of outputs.

The goal of this series of posts is to get you from the lower levels to the higher levels. I will be guiding using technology stack agnostic terms and ideas such that no matter what specific tools you have available to you, you will be able to pick them up quickly with a strong foundation of knowledge.

This guide will assume you have used a "chatbot" before like [ChatGPT](https://chatgpt.com/) or [Gemini](https://gemini.google.com) and are sitting somewhere around level 1 or level 2.

## What is AI? in 100 seconds

In the context of this series, AI is a tool that you will be leveraging off of. We will specifically be using large language models (LLMs) to achieve our goals. LLMs simply output text. The only important terms you need to know for this guide are: models, prompts, and context (window).

To explain those terms practically, it's easiest to use a chatbot chat as an example. When you "chat" with one of these chatbots, every you send a message to it is called a **prompt**. These chatbots will reply back to you with their own messages. Every message exchanged between you and the chatbot is called the **context** or **context window**. The "person" you are chatting with you is the **model**.

The models inherently have a lot of knowledge baked in through training and have names such as ChatGPT-4.1, Claude Sonnet 4, Gemini Pro 2.5. These names aren't important, but you will definitely hear about them and they will be outdated when you read this. For our purposes, the knowledge these models have can be considered part of the context. The inherent knowledge has a cutoff date. You do not need to know when they are, but just that this is a limitation as you cannot* ask any of these models what happened today on July 25th, 2025 and expect them to know.

I'm sorry, I will be using AI/LLM/chatbot interchangeably through this guide as it is sometimes easier to frame them in a certain light, but in reality I meant them to be the same thing.

*: If you actually chat with a chatbot and ask about what's happening today, some of them may actually be able to answer. This is because they used a "tool" to search and get current events. The chatbot in theory could be cut off from this tool and would have to rely only on the latest information from the training.

## Skills

OK, so you know briefly what AI is, but how do you use it? Using AI will be either explicitly or implicitly through a "chat." Whether you are asking questions in a prompt or using it to write code, it's all communicated through chat, but structured in a way to make things happen. These are the foundational skills needed to make something beyond level 2.

These skills will be introduced at a high level in this post, but there will be some more specific how-tos later. Again, I am refraining from specific implementations to make this knowledge portable and customizable to your specific use-case.

### Prompting

I assume you have sent some prompts to a chatbot before asking questions, but maybe not in the most effective way possible. The skill of prompting or *prompt engineering* is one that sits independent form the other skills we will talk about. The other skills all work together more directly in implementing a project. Prompting by itself is for building up the context *you* need to be successful. That said, I will not be crash-coursing this section for you, but instead I will point you to a very good guide at [Prompting Guide](https://www.promptingguide.ai/) which is where I learned to improve my prompting. I will however give you a snippet of an actual prompt I used to improve my Boba language documentation.

```prompt
I have people weighing in on this to decide the chapters of a "learning" tutorial/book that has the goal of getting a programmer to a productive state fast and successfully while following both the book and a "rustlings"-like do as you learn by doing in parallel. only gently steer the guide towards the structure rustlings has. the people here are: specialist in how people learn, a college cs professor who wants to give them a rustlings-like experience, and a book editor who specializes in reference books/text books, and a junior software engineer familiar with rustlings. using feedback of everyone else, i want the editor to curate (empowered to add/remove current contents and ignore/improve upon feedback from others) changes to the contents of this book for the boba programming language. the editor should give me instructions on how to make the changes and does not need to tell me what didn't change. let's go 2 chapters at a time. give me chapters 1 and 2 feedback and changes first.


<content>

# learn


## Chapter 1: Getting Started: Your First Program

...
</content>
```

My personal style is not as formal as the Prompting Guide, but I definitely drew inspirations. My TLDR of prompting: add roleplay for the AI to take on, use demarcations of where certain things are like opening tags `\<content>` and closing tags `\</content>` in my exmaple, and ask for clear outputs.

### Managing Context

Every model has varying context windows. When you are chatting and the conversation has gotten very long (beyond the context window), the chat will become worse quality and the chatbot will be unable to remember things said earlier in the chat. If you ask the chatbot to recall something within the window and the window is full, it is less likely the chatbot will correct. Therefore, one of the best practices is to start a new chat often. The best rule of thumb is to start a new chat when you are switching to a completely different topic of a question or a different task. This is to prevent the AI from potentially using data that is irrelevant.

In cases where you want the AI to write a specific piece of code using technology that is newer than what the AI knows based off it's training, your job now is to put that knowledge into the context. Send it the documentation in your chat window. Keep in mind that AI will "forget" all this when you start a new chat. This doesn't even have to be code. It can be a specific design, documentation, etc. that's specific to your company or project.

Your ultimate goal of "managing context" is to make sure that the context window is filled enough for the AI to accomplish it's goal no matter whether it's code or a report. People call this *context engineering*. The goal is also to reduce the amount of "bad context" or useless information or irrelevant information.

### Planning

OK so you have a task or a project you need to do, but you have previously tried to just tell AI something like "make me a 2D platformer" and you got something that does play like a 2D platformer, but it looks like Mario and your controls are the arrow keys and only works in the browser. This probably isn't what you had in mind, so you start adding more description and context to the chat. It gets better, but some issues come up and you feed back that information. Eventually you stop having success in your chat, and it becomes an unusable dumpster fire. This is because the context is so large, contains bad information and code that the AI cannot help you anymore in it's current state.

The best solution is to come up with a good plan of what you want to make before you start making. That's not a very exciting answer to hear, but developing a project plan (commonly called a product requirements document or PRD) and/or a set of clear tasks is the best way to leverage AI in more complex tasks. Your job has now drifted towards a project manager. The most successful* users I have observed in AI are *always* writing their project plans and creating a task list of small tasks to do their work. This seems like a lot of work, but the good news is you can build this documentation, but chatting with an AI about it. A prompt like "Guide me through developing a product requirements document for my 2D platformer and output that document when we are done" will not only help you figure out what you want, but provide a lot of very good context for the AI to use. This PRD should be read every time the AI starts doing work on the project.

With this PRD, it's best to also create a task list. This task list is used to keep track of the state of the project, but also creates a logical flow of what will need to be done in order for the project to work. A very simple task list could be as follows for our 2D platformer example:

1. Setup project scaffolding for 2D platformer in C# using Monogame framework.
2. Display basic window with player standing on a platform.
3. Add controls to allow player to move and jump.
4. Add enemies with simple AI that will just walk forward.

By breaking down these into smaller discrete tasks, the context within each task will be smaller and not polluted with irrelevant information. In our above task list, knowing the internals of how to setup the Monogame framework from step 1 will not be helpful in implementing the player controls in step 3.

The rule of thumb from the planning skill is to: use an AI chat to develop a plan and a task list.

*: This is anecdotal, but go ahead and try to not use a plan and tasks for making complex projects and you tell me how much success you had.

### Tools

Tools are capabilities that your AI has. With writing code, AI is exposed to (names will vary) `write_file`, `read_file`, and maybe even `execute`. This essentially lets the AI write code and run it. However, what if we need more capabilities such as `setup_database` or `git_commit` or `get_docs`? We can extend AI capabilities by giving it more tools. A commonly used documentation tool is [Context7](https://github.com/upstash/context7). This allows the AI to search for documentation and read how to do something. On your part, you just have to hook up the tools and then also make the AI aware that these tools are available *and* to actually use them.

In the world of software engineering, many tools are already written and you can find them by searching for "\<tool name>" MCP servers. If one does not exist, you can create one... using AI! I won't go too much into the details in this post, but I will say that *you can build it if it doesn't exist* should be a new mantra with your newfound skills.

### Agents

All of those previous skills have culminated into this one. This isn't a skill on it's own per se, but using agents is the end game. So what is an agent? An agent is when the AI is able to go off on it's own, "think", apply tools to do what you are asking it to do, and come back when it needs help or it's done.

## Conclusion

These are just some of the abstracted skills to get going with AI. If you are able to understand these, the specific implementations such as terminal agents, chat in browsers, or IDE agents will be less confusing.