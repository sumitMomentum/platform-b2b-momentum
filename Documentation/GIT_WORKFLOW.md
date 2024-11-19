# Git Workflow

This document outlines the Git workflow used for managing our project. It includes branch structure, workflow steps, and conventions for managing and merging branches effectively.

---

## **Branch Structure**

1. **Main**:

   - Temporary branch created by GitHub, currently used to store stable versions.
   - Will be deleted once a more robust branching strategy is established.
2. **Production**:

   - Stores the latest stable release that is ready for deployment.
   - Only updated from the `development` branch once it's thoroughly tested and verified.
3. **Development**:

   - Contains the latest features and bug fixes.
   - Updated by merging feature, test, or bug branches after successful local testing and preview deployment.
4. **Feature Branches**:

   - For developing new features.
   - Named as `feature/<feature-name>`.
5. **Test/Bug Branches**:

   - For fixing bugs or testing features.
   - Named as `test/<test-name>` or `bug/<bug-name>`.
6. **Issue Branches**:

   - Automatically created via GitHub Projects for specific tasks/issues.
   - Name format varies, but functionality remains the same.

---

## **Workflow Steps**

### 1. **Create and Work on a Branch**

- For a new feature, bug, or test:
  ```bash
  git checkout -b feature/<branch-name>  # For a feature
  git checkout -b test/<branch-name>    # For testing
  git checkout -b bug/<branch-name>     # For bug fixes
  ```
- For a GitHub Project issue/task:
  - Use the **"Create branch"** option from the issue/task details.
    This will automatically create a branch with the issue name.

### 2. **Push Changes for Preview**

- After successfully running and building locally:
  ```bash
  git add .
  git commit -m "Commit message describing the work"
  git push origin <branch-name>
  ```
- This will trigger an automatic deployment on Vercel as a preview.

### 3. **Test Preview Deployment**

- Test the deployed preview on Vercel.
- Ensure functionality, bug fixes, and features work as expected.

### 4. **Merge into Development**

- If the branch passes preview testing:
  ```bash
  git checkout development
  git pull origin development  # Get the latest changes
  git merge <branch-name>
  ```
- Resolve any merge conflicts.
- After merging:
  ```bash
  git push origin development
  git branch -d <branch-name>  # Delete the local branch
  git push origin --delete <branch-name>  # Delete the remote branch
  ```

### 5. **Merge Development into Production**

- Once `development` has all the latest updates and is stable:
  ```bash
  git checkout production
  git pull origin production  # Get the latest changes
  git merge development
  ```
- Resolve any merge conflicts.
- After merging:
  ```bash
  git push origin production
  ```

### 6. **Main Branch**

- Temporarily used to store stable versions.
- Will be deleted in the future:
  ```bash
  git branch -d main  # Locally
  git push origin --delete main  # Remotely
  ```

---

## **Cleaning Up Local Branches**

### Purpose

As part of maintaining a clean local development environment, it's essential to remove local branches that no longer have corresponding remote branches. These branches are usually orphaned when their remote counterparts are deleted after merging or during repository cleanup.

### Command to Remove Orphaned Branches

Use the following command to delete all local branches that no longer exist on the remote repository:

```bash
git fetch --prune && \
for branch in $(git branch --format '%(refname:short)' --merged | grep -vE '^(main|production|development)$'); do
  if ! git show-ref --verify --quiet refs/remotes/origin/"$branch"; then
    git branch -d "$branch"
  fi
done
```

### Steps:

1. **Fetch and Prune:**

   - `git fetch --prune` ensures that outdated references to remote branches are removed from your local repository.
2. **Filter Local Branches:**

   - The `git branch --format '%(refname:short)' --merged` command lists all local branches merged into the current branch.
3. **Check Remote Existence:**

   - For each branch, the script verifies whether a corresponding remote branch exists using `git show-ref`.
4. **Delete Orphaned Branches:**

   - If the branch does not exist on the remote, it is deleted locally with `git branch -d`.

### Notes:

- **Protected Branches:** The script avoids deleting essential branches like `main`, `production`, and `development`.
- **Merged Branches Only:** Only branches that have been merged into the current branch will be considered for deletion.
- **Safety:** This approach ensures that no unmerged or active branches are removed.

---


## **Synchronizing Remote Branches to Local Repository**

### Purpose

To ensure your local repository is updated with the latest branches created on the remote (`origin`), follow these steps. This helps you stay in sync with your team's work and access newly created branches.

---

### Steps to Fetch and Sync Remote Branches

1. **Fetch All Remote Branches**To update your local repository with all remote branches, run:

   ```bash
   git fetch --all
   ```

   This command fetches the latest references, including new branches, from all remotes.
2. **List Remote Branches**To view all branches available on the remote repository:

   ```bash
   git branch -r
   ```
3. **Check Out a Specific Remote Branch Locally**To create a local branch that tracks a specific remote branch:

   ```bash
   git checkout -b <branch-name> origin/<branch-name>
   ```

   Replace `<branch-name>` with the name of the remote branch you want to check out.
4. **Optional: Pull Updates for All Branches**To ensure all local branches are updated with the latest changes from their remote counterparts:

   ```bash
   git pull --all
   ```
5. **Optional: Track All Remote Branches Locally**
   To create local tracking branches for all remote branches automatically:

   ```bash
   git fetch --all
   for branch in $(git branch -r | grep -v '\->'); do
     git branch --track "${branch#origin/}" "$branch" 2>/dev/null || true
   done
   ```

---

### Notes

- **Tracking Branches:**When you create a local branch using `git checkout -b <branch-name> origin/<branch-name>`, the branch is set to track its remote counterpart, making it easier to pull updates in the future.
- **Selective Branch Creation:**Instead of creating local branches for all remote branches, fetch only the branches you need to minimize clutter.
- **Conflict Avoidance:**
  Ensure that the branch you are tracking does not conflict with an existing local branch of the same name.

---

## **GitHub Projects Integration**

- When managing tasks/issues through GitHub Projects:
  - Use the **"Create branch"** option from the issue details to automatically create a branch.
  - The branch name will be generated based on the issue name.
  - Workflow remains the same:
    Push → Preview → Merge → Delete branch.

---

## **Commands Summary**

### Common Commands

```bash
# Create a new branch
git checkout -b <branch-name>

# Push changes
git add .
git commit -m "Commit message"
git push origin <branch-name>

# Merge branches
git checkout <target-branch>
git pull origin <target-branch>
git merge <source-branch>

# Resolve merge conflicts if any
# Push changes
git push origin <target-branch>

# Delete branch
git branch -d <branch-name>  # Locally
git push origin --delete <branch-name>  # Remotely
```

### Example Workflows

#### Feature Workflow

```bash
git checkout -b feature/new-login-page
# Work on the feature
git add .
git commit -m "Add login page"
git push origin feature/new-login-page
# Test preview, then merge into development
git checkout development
git pull origin development
git merge feature/new-login-page
git push origin development
git branch -d feature/new-login-page
git push origin --delete feature/new-login-page
```

#### Development to Production

```bash
git checkout production
git pull origin production
git merge development
git push origin production
```

---

## **Prisma Commands**

### Common Commands

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations to the database in development
npx prisma migrate dev --name <migration-name>

# Apply migrations to production
npx prisma migrate deploy

# Seed the database
npx prisma db seed

# Pull database schema changes
npx prisma db pull

# Push schema changes to the database
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

---

This document provides a clear structure for managing the Git workflow and integrates Prisma commands for seamless database management.
