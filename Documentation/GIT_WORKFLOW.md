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
