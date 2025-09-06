# E2E Platform - Dev Notes

## Project Structure

- `/app` - Main Next.js application
- `/components` - Reusable UI components (e.g., navbars, buttons, modals)
- `/lib` - Utility functions and API calls
- `/styles` - Global styles
- `/public` - Static assets (e.g., images, fonts)

## Development Guidelines

- **Naming Conventions:**

  - Use **PascalCase** for components (`Navbar.tsx`, `UserCard.tsx`).
  - Use **camelCase** for variables and functions (`handleClick`, `fetchData`).
  - Use **kebab-case** for folders (`landing-page/`, `job-listings/`).

- **Pages:**

  - Each page must have a **`page.tsx`** file inside its corresponding folder.
  - Example folder structure:
    ```
    /app
    ├── /landing
    │    ├── /jobs
    │    │    ├── page.tsx   <-- (Jobs Page)
    │    ├── page.tsx   <-- (Landing Page)
    ```

- **Components:**

  - Store reusable components inside `/components`.
  - Example:
    ```
    /components
    ├── Navbar.tsx
    ├── Button.tsx
    ├── /icons
    │    ├── UploadIcon.tsx
    ```

- **Icons:**

  - Always use **SVGs** for icons.
  - Save icons as `.tsx` components inside `components/icons/`.
  - Example:
    ```tsx
    export default function UploadIcon() {
      return <svg>...</svg>;
    }
    ```
  - Import like this:

    ```tsx
    import UploadIcon from "@/components/icons/UploadIcon";

    ## Commit Message Guidelines
    ```

## Commit Message Formats

Here are the common prefixes used in our commits:

- **feat:** Adding a new feature
- **fix:** Bug fixes and patches
- **chore:** Maintenance tasks (e.g., refactoring, renaming files)
- **docs:** Documentation updates (e.g., README, Dev Notes)
- **style:** Code formatting (e.g., indentation, spacing, no logic changes)
- **refactor:** Code restructuring without changing functionality
- **test:** Adding or updating tests
  ```

  ```
