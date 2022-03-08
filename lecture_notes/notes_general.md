# **General Notes**

---

## [Git CLI](https://git-scm.com/docs)

[GitLab Documentation](https://docs.gitlab.com/)

[Github cheatsheet](https://training.github.com/downloads/github-git-cheat-sheet/)

Create a new repository in the CLI:

```Bash
echo "# <repo_name>" >> README.md
git init
git add README.md
git add .  # If you wish to add all files in cwd
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/LiamLage/<repo_name>.git
git push -u origin main
```

Push an existing repository from the CLI:

```Bash
git remote add origin https://github.com/LiamLage/<repo_name>.git
git branch -M main
git push -u origin main
```

---

## Non Specific Notes

So far this course is placing a lot of emphasis on callback functions. I will convert them into
promises after section 5 where I will learn about promises.

---
