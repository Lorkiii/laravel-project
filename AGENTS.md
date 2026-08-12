# AGENTS.md

## Project Overview

This project is an **Inventory Management System** built with:

* Laravel 12
* PHP
* Inertia.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Spatie Laravel Permission
* PostgreSQL / Supabase
* Vite

The application manages products, categories, inventory, stock movements, users, roles, permissions, and related administrative operations.

The project has three primary roles:

* **Admin**
* **Manager**
* **Staff**

The application should remain simple, maintainable, consistent, and appropriate for its current scope.

---

# 1. Core Engineering Principles

Follow these principles for every change.

## 1.1 Inspect Before Changing

Before creating, modifying, or refactoring code:

1. Inspect the existing implementation.
2. Search for similar functionality.
3. Reuse existing components, helpers, types, routes, controllers, and patterns when appropriate.
4. Follow the existing project structure.
5. Only introduce a new abstraction when the existing abstractions genuinely cannot support the requirement.

Do not assume that a new file or component is necessary.

Prefer:

> Reuse existing code → refactor existing code → create new code only when necessary.

---

# 2. Avoid Over-Engineering

Keep implementations proportional to the application's requirements.

Do not introduce:

* unnecessary design patterns
* unnecessary service classes
* unnecessary repositories
* unnecessary interfaces
* unnecessary factories
* unnecessary abstractions
* unnecessary custom hooks
* unnecessary state-management libraries
* unnecessary API layers
* unnecessary helper functions
* unnecessary dependencies
* unnecessary configuration
* unnecessary components

Do not create an abstraction simply because it is theoretically reusable.

A small amount of duplicated code can be preferable to a complicated abstraction.

Follow the rule:

> Simple and clear is better than clever and complicated.

---

# 3. Always Refactor When Appropriate

When modifying existing functionality:

* Look for obvious duplication.
* Remove dead code.
* Remove unused imports.
* Remove obsolete comments.
* Remove unnecessary variables.
* Simplify unnecessarily complicated logic.
* Reuse existing components.
* Reuse existing types.
* Keep related logic together.

Do not perform large unrelated refactors while implementing a feature.

Only refactor code that is:

* directly related to the current task, or
* clearly necessary to safely implement the task.

Avoid changing working code merely for stylistic preference.

---

# 4. Do Not Hardcode

Avoid hardcoding values that belong in reusable constants, configuration, database data, or existing application structures.

Avoid hardcoding:

* URLs
* route paths
* permission names
* role names
* status labels
* navigation links
* repeated UI labels
* database IDs
* category IDs
* user IDs
* environment-specific values
* API endpoints
* configuration values

Use existing mechanisms such as:

* Laravel named routes
* Ziggy
* configuration files
* environment variables
* database relationships
* TypeScript constants/types
* existing utility functions
* existing application configuration

However, do not create constants for every string.

Only extract values when doing so provides meaningful reuse, consistency, or maintainability.

---

# 5. Follow the Existing Style

The existing project style has priority over personal coding preferences.

When adding code:

* Follow existing naming conventions.
* Follow existing indentation.
* Follow existing import ordering.
* Follow existing component patterns.
* Follow existing Tailwind conventions.
* Follow existing form patterns.
* Follow existing controller patterns.
* Follow existing TypeScript patterns.
* Follow existing validation patterns.

Do not introduce a different coding style for a single feature.

If an existing component or page uses a particular pattern, follow that pattern unless there is a strong technical reason to change it.

---

# 6. Folder Structure

Keep backend and frontend responsibilities clearly separated.

Recommended structure:

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Category/
│   │   ├── Product/
│   │   ├── Inventory/
│   │   └── ...
│   └── Requests/
│       ├── Category/
│       ├── Product/
│       └── ...
│
├── Models/
│   ├── User.php
│   ├── Product.php
│   ├── Category.php
│   └── StockMovement.php
│
└── Providers/

database/
├── factories/
├── migrations/
└── seeders/

resources/
├── js/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   ├── Categories/
│   │   ├── Inventory/
│   │   └── Users/
│   ├── types/
│   ├── lib/
│   └── app.tsx
│
└── css/

routes/
├── web.php
└── ...

tests/
├── Feature/
└── Unit/
```

Do not create additional top-level architectural directories unless there is a real project requirement for them.

---

# 7. Laravel Backend Rules

## 7.1 Controllers

Controllers should coordinate requests and application behavior.

Keep controllers reasonably thin.

A controller should generally:

1. Receive the request.
2. Validate input.
3. Perform the required operation.
4. Return an Inertia response or redirect.

Avoid putting large amounts of business logic directly inside controllers.

Do not create service classes automatically.

Create a service only when the logic is:

* sufficiently complex,
* reused in multiple places,
* or clearly represents a distinct business operation.

---

# 8. Models

Use Eloquent relationships and model behavior appropriately.

Prefer:

```php
$product->category
```

over manually querying the category when the relationship already exists.

Define relationships explicitly:

```php
public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}
```

Keep model configuration such as:

* `$fillable`
* `$casts`
* relationships
* simple model events

inside the model.

Do not put unrelated business logic into models.

---

# 9. Database Rules

Use migrations for all schema changes.

Never manually modify the database schema without a corresponding migration.

Use:

* foreign keys
* appropriate indexes
* unique constraints
* nullable columns only when necessary
* appropriate data types
* timestamps where appropriate

Prefer database constraints over relying entirely on application logic.

For example:

```php
$table->foreignId('category_id')
    ->constrained()
    ->cascadeOnDelete();
```

Use meaningful column names.

Do not store values in the database that can be derived from existing relationships unless there is a clear performance or business reason.

---

# 10. Validation

Validate all user-controlled input.

Prefer Laravel Form Request classes when validation becomes substantial or is reused.

For simple CRUD operations, existing project conventions may be followed.

Validation rules should be explicit.

Example:

```php
'name' => ['required', 'string', 'max:100'],
```

Do not trust frontend validation alone.

Backend validation is authoritative.

---

# 11. Inertia.js Rules

This project uses Inertia.js rather than building a separate REST API for normal page interactions.

Prefer:

```php
return Inertia::render('Products/Index', [
    'products' => $products,
]);
```

over creating unnecessary API endpoints.

Use Inertia navigation and forms for normal application interactions.

Do not introduce Axios or a separate API layer unless the feature genuinely requires it.

---

# 12. React / TypeScript Rules

Use TypeScript for frontend code.

Avoid `any` unless there is a legitimate reason.

Prefer explicit types:

```ts
type ProductStatus = 'active' | 'inactive';
```

Reuse existing types instead of redefining the same entity in multiple files.

If a type is shared across multiple components/pages, place it in the appropriate shared `types` directory.

Do not create a type file for a type that is only used locally unless there is a clear reason.

---

# 13. React Component Rules

Components should have one clear responsibility.

Prefer:

```text
ProductForm
Field
DataTable
EmptyState
```

over extremely large components containing the entire application's UI.

However, do not split every small piece of JSX into its own component.

Create a component when it:

* is reused,
* has meaningful independent behavior,
* improves readability,
* or represents a clear UI concept.

Avoid components such as:

```text
ProductNameLabel
ProductPriceText
ProductIconWrapper
```

unless they have meaningful reusable behavior.

---

# 14. Reusable UI Components

Use existing shadcn/ui components whenever available.

Prefer existing components such as:

```text
Button
Input
Textarea
Select
Dialog
DropdownMenu
Card
Table
Badge
```

Do not create a custom component when an existing shadcn/ui component already satisfies the requirement.

Reusable application components should live under:

```text
resources/js/components/
```

Page-specific components may remain near their page when they are not reused elsewhere.

---

# 15. Tailwind CSS Rules

Use the project's existing Tailwind styles.

Do not introduce a new visual system for a single page.

Follow existing:

* spacing
* typography
* border radius
* shadows
* colors
* responsive behavior
* button styles
* form styles
* table styles

Prefer Tailwind utilities over creating custom CSS when Tailwind can handle the requirement.

Do not add custom CSS merely to solve something already supported by Tailwind.

---

# 16. UI Consistency

All pages should feel like part of the same application.

When creating a new page:

1. Inspect an existing page with a similar purpose.
2. Reuse its layout.
3. Reuse its spacing.
4. Reuse its form patterns.
5. Reuse its buttons.
6. Reuse its table patterns.
7. Reuse its feedback/error patterns.

Do not redesign the application while implementing a single feature.

---

# 17. Forms

Use the project's existing Inertia form approach.

Do not introduce React Hook Form unless the project has a genuine requirement that cannot be handled cleanly by Inertia's `useForm`.

Forms should:

* display validation errors
* preserve values when appropriate
* show processing state
* prevent duplicate submissions
* use existing form components
* follow existing layout patterns

Keep form components reusable when the same form is used for create/edit functionality.

---

# 18. Routing

Use Laravel named routes.

Use Ziggy or the project's existing route helper approach from React.

Do not hardcode URLs such as:

```ts
'/products'
```

when an existing route helper is available.

Prefer the project's established route helper.

---

# 19. Authorization

Authorization must be enforced on the backend.

Never rely only on hiding buttons in React.

The frontend may hide unavailable actions for UX, but Laravel must still enforce the permission.

Example:

```php
$this->authorize('create', Product::class);
```

or the project's existing Spatie permission approach.

Every sensitive operation must have server-side authorization.

---

# 20. Roles

The application has three primary roles:

```text
Admin
Manager
Staff
```

Roles should represent responsibilities, while permissions should represent specific capabilities.

Do not check roles everywhere when a permission check is more appropriate.

Prefer permissions such as:

```text
view products
create products
edit products
delete products

view categories
manage categories

view users
manage users
```

Use role checks only when behavior is genuinely role-specific.

---

# 21. ADMIN ROLE

The Admin is responsible for system administration and has the highest level of access.

## Admin CAN:

### Users

* View users
* Create users
* Edit users
* Activate users
* Deactivate users
* Assign roles
* Manage user permissions

### Products

* View products
* Create products
* Edit products
* Delete products

### Categories

* View categories
* Create categories
* Edit categories
* Delete categories

### Inventory

* View inventory
* Perform stock adjustments
* Record stock-in
* Record stock-out
* Review stock movements

### Reports

* View inventory reports
* View management-level reports

### System

* Manage roles
* Manage permissions
* Access administrative functionality

## Admin CANNOT:

There should be no ordinary inventory-management restriction on Admin.

Admin is the highest application role.

However, dangerous/destructive operations should still use appropriate authorization and confirmation.

---

# 22. MANAGER ROLE

The Manager is responsible for day-to-day inventory operations.

The Manager should not have system-administration responsibilities.

## Manager CAN:

### Products

* View products
* Create products
* Edit products

### Inventory

* View inventory
* Monitor stock levels
* Record stock-in
* Record stock-out
* Perform permitted inventory adjustments
* Review stock movements

### Reports

* View inventory reports
* View relevant operational reports

### Categories

By default, the Manager does NOT manage categories.

The Manager can use existing categories when creating or editing products.

## Manager CANNOT:

* Manage users
* Create users
* Delete users
* Assign roles
* Manage roles
* Manage permissions
* Create categories
* Edit categories
* Delete categories
* Delete products
* Change system settings

The Manager's responsibility is:

> Manage inventory operations, not system configuration.

---

# 23. STAFF ROLE

Staff performs routine inventory operations.

Staff has the most restricted access.

## Staff CAN:

### Products

* View products
* Search products
* View product details

### Inventory

* View relevant stock information
* Perform authorized stock transactions
* Record stock-out
* Perform other inventory actions explicitly granted by the system

### Activity

* View their own relevant transaction history when supported

## Staff CANNOT:

* Create products
* Edit products
* Delete products
* Create categories
* Edit categories
* Delete categories
* Manage users
* Assign roles
* Manage permissions
* Access administrative settings
* Perform management-only operations
* Access restricted management reports

The Staff's responsibility is:

> Perform routine inventory transactions without changing system configuration or master data.

---

# 24. Permission Matrix

The following is the default authorization model:

| Permission / Feature | Admin |    Manager   |     Staff    |
| -------------------- | :---: | :----------: | :----------: |
| View Dashboard       |   ✅   |       ✅      |       ✅      |
| View Products        |   ✅   |       ✅      |       ✅      |
| Create Products      |   ✅   |       ✅      |       ❌      |
| Edit Products        |   ✅   |       ✅      |       ❌      |
| Delete Products      |   ✅   |       ❌      |       ❌      |
| View Categories      |   ✅   |       ✅      |   Optional   |
| Create Categories    |   ✅   |       ❌      |       ❌      |
| Edit Categories      |   ✅   |       ❌      |       ❌      |
| Delete Categories    |   ✅   |       ❌      |       ❌      |
| View Inventory       |   ✅   |       ✅      |       ✅      |
| Stock In             |   ✅   |       ✅      | ✅/Configured |
| Stock Out            |   ✅   |       ✅      |       ✅      |
| Stock Adjustment     |   ✅   | ✅/Configured |       ❌      |
| View Stock Movements |   ✅   |       ✅      |    Limited   |
| Inventory Reports    |   ✅   |       ✅      |       ❌      |
| View Users           |   ✅   |       ❌      |       ❌      |
| Manage Users         |   ✅   |       ❌      |       ❌      |
| Manage Roles         |   ✅   |       ❌      |       ❌      |
| Manage Permissions   |   ✅   |       ❌      |       ❌      |
| System Settings      |   ✅   |       ❌      |       ❌      |

If business requirements change, update the permission model rather than bypassing authorization in individual pages.

---

# 25. Product Rules

Products should contain the established product information, including:

* name
* brand
* model
* SKU
* description
* price
* quantity
* minimum stock
* status
* category

Do not duplicate category names directly into products when a relationship already exists.

Use:

```text
product.category_id
```

and the Eloquent relationship.

---

# 26. SKU Rules

SKU generation should be centralized.

Do not generate SKUs independently in multiple controllers or React components.

SKU generation belongs to the backend.

SKUs must remain unique.

When modifying SKU generation:

* preserve uniqueness
* preserve existing conventions
* avoid duplicated logic
* handle collisions safely
* do not rely on the frontend to generate the final SKU

The database should enforce SKU uniqueness.

---

# 27. Inventory Rules

Inventory quantity represents the current stock level.

Stock changes should be traceable.

When appropriate, use stock movement records rather than silently changing quantities without a history.

A stock movement should be associated with:

* product
* user
* movement type
* quantity
* relevant timestamps
* other fields required by the existing schema

Do not introduce a complicated inventory architecture unless the requirements require it.

---

# 28. Stock Movement Rules

Stock movement types should be represented consistently.

Do not use arbitrary strings throughout the codebase.

If the project establishes a fixed set of movement types, centralize those values appropriately.

Example:

```text
stock_in
stock_out
adjustment
```

Do not allow unauthorized users to create arbitrary movement types.

---

# 29. Database Query Rules

Prefer Eloquent query builder and relationships.

For example:

```php
Product::query()
    ->orderBy('name')
    ->get();
```

Use:

```php
Product::all();
```

only when no query customization is necessary.

Use eager loading when relationships are required:

```php
Product::with('category')->get();
```

Avoid N+1 queries.

Do not load unnecessary columns or relationships.

---

# 30. Performance

Do not optimize prematurely.

First write clear, correct code.

Optimize when there is:

* a demonstrated performance problem,
* a large dataset,
* an expensive query,
* or an obvious N+1 problem.

Prefer simple optimizations:

* eager loading
* proper indexes
* pagination
* selecting required columns
* avoiding unnecessary queries

Do not introduce caching merely because caching is theoretically possible.

---

# 31. Error Handling

Use Laravel's existing validation and exception handling mechanisms.

Do not expose:

* stack traces
* database credentials
* SQL errors
* internal implementation details

to normal users.

Frontend errors should be understandable and consistent with the application's existing UI.

---

# 32. Security

Never trust frontend authorization.

Never trust frontend validation.

Never accept sensitive identifiers without server-side validation.

Never expose:

* passwords
* secrets
* API keys
* database credentials
* environment variables

Do not commit `.env` files.

Use environment variables for environment-specific configuration.

---

# 33. Authentication

Authentication should use Laravel's established authentication system.

Do not create a second authentication mechanism unless explicitly required.

User status such as active/inactive should be enforced server-side.

Deactivated users should not be able to perform authenticated operations if the application's authentication requirements prohibit them.

---

# 34. React Authorization

Frontend authorization is for UX only.

It is acceptable to conditionally render:

```tsx
{canCreateProduct && (
    <Button>Create Product</Button>
)}
```

But this must never be considered sufficient security.

The backend must independently verify the permission.

---

# 35. Navigation

Navigation should reflect the user's permissions.

Users should not see navigation items for features they cannot access when permission data is available.

However, hiding navigation is not authorization.

The route/controller must still enforce access.

---

# 36. CRUD Design

Use conventional CRUD behavior.

For example:

```text
Products
├── Index
├── Create
├── Show
└── Edit
```

Do not introduce modals for every CRUD operation.

Use the application's established UI pattern.

For larger forms, prefer a dedicated page when it improves usability.

---

# 37. Page Organization

Pages should be organized by domain.

Example:

```text
resources/js/pages/

Dashboard/

Products/
├── Index.tsx
├── Create.tsx
├── Edit.tsx
└── Show.tsx

Categories/
├── Index.tsx
├── Create.tsx
└── Edit.tsx

Inventory/
├── Index.tsx
└── ...

Users/
├── Index.tsx
├── Create.tsx
└── Edit.tsx
```

Do not put every page directly into `pages/`.

Use domain-based folders as the application grows.

---

# 38. Shared Components

Use:

```text
resources/js/components/
```

for components shared across multiple domains.

Examples:

```text
components/
├── forms/
│   ├── Field.tsx
│   └── ...
├── navigation/
├── tables/
└── ui/
```

Do not move a component into shared components merely because it exists.

Move it when it is genuinely shared.

---

# 39. Page-Specific Components

If a component only belongs to Products, keep it associated with Products rather than prematurely making it global.

For example:

```text
pages/Products/components/
```

may contain:

```text
ProductForm.tsx
ProductFilters.tsx
ProductTable.tsx
```

if those components are specific to Products.

---

# 40. Type Organization

Use shared types for shared domain entities.

For example:

```text
resources/js/types/
├── product.ts
├── category.ts
├── user.ts
└── ...
```

Avoid duplicating:

```ts
type Product = ...
```

in multiple pages.

If the same type is needed in multiple places, create one canonical definition.

---

# 41. Naming Conventions

Use descriptive names.

PHP:

```text
ProductController
ProductRequest
StockMovement
```

React:

```text
ProductForm
ProductTable
ProductFilters
```

Types:

```text
Product
ProductFormValues
ProductStatus
```

Avoid unclear names such as:

```text
Data
Thing
Item
Temp
Stuff
Helper
Utils
```

unless the name genuinely represents a generic concept.

---

# 42. Comments

Write comments only when they explain something that is not obvious from the code.

Good:

```php
// Generate the SKU only when it was not supplied manually.
```

Bad:

```php
// Set sku to sku.
$sku = $sku;
```

Do not use comments to compensate for unnecessarily complicated code.

Prefer readable code.

---

# 43. Dependency Rules

Do not install a package for a problem that can reasonably be solved using:

* Laravel
* Inertia
* React
* TypeScript
* Tailwind
* existing project utilities
* existing shadcn/ui components

Before adding a dependency:

1. Check whether the project already has a solution.
2. Check whether the framework already provides the functionality.
3. Determine whether the dependency materially reduces complexity.
4. Consider long-term maintenance.

Do not add dependencies casually.

---

# 44. API Rules

This application primarily uses Inertia for server/client communication.

Do not create an API endpoint simply because the frontend needs data.

Create an API only when there is a real requirement such as:

* external clients
* mobile applications
* third-party integrations
* asynchronous systems
* a clearly defined API boundary

---

# 45. Testing

When adding important application behavior, consider whether it needs a test.

Prioritize tests for:

* authorization
* product creation
* product updates
* SKU generation
* inventory changes
* stock movements
* user permissions
* critical validation
* destructive operations

Do not create excessive tests for trivial presentation-only code.

---

# 46. Before Modifying Code

Before making changes, determine:

1. What existing feature is closest to this requirement?
2. Is there already a component that can be reused?
3. Is there already a type for this?
4. Is there already a route helper?
5. Is there already a validation pattern?
6. Is there already an authorization mechanism?
7. Is there already a similar controller?
8. Is there already a similar page?
9. Can the requirement be solved without adding a dependency?
10. Can the change remain simple?

---

# 47. Before Creating a New File

Do not immediately create a new file.

First ask:

> Can this functionality reasonably live in an existing file?

Create a new file only when it improves organization, reuse, separation of responsibility, or maintainability.

---

# 48. Before Creating a New Component

Search the existing components first.

If an existing component can be extended without making it confusing, prefer extending it.

If the component becomes too specific or complex, create a new component.

Do not duplicate components with nearly identical behavior.

---

# 49. Before Creating a New Permission

Check whether an existing permission already represents the capability.

Prefer specific permissions:

```text
view products
create products
edit products
delete products
```

rather than overly broad permissions:

```text
manage everything
manage products
```

unless the broader permission is intentionally part of the authorization design.

---

# 50. Permission Naming

Permission names should be:

* lowercase
* descriptive
* consistent
* action-oriented

Examples:

```text
view products
create products
edit products
delete products

view categories
manage categories

view users
manage users
```

Do not introduce inconsistent names such as:

```text
product.create
create_product
Create Product
canCreateProduct
```

unless the project deliberately changes its permission convention.

---

# 51. Admin vs Manager Boundary

The primary distinction is:

```text
Admin   = System Administration
Manager = Inventory Management
Staff   = Inventory Operations
```

Do not blur these responsibilities without a business requirement.

Categories, users, roles, permissions, and system configuration are administrative concerns.

Products, stock, inventory, and stock movements are operational concerns.

---

# 52. Business Rules Over UI Rules

Never implement a business rule only in React.

For example, this is insufficient:

```tsx
if (user.role === 'Admin') {
    showDeleteButton();
}
```

The backend must also enforce the permission.

Frontend:

```text
Improve UX
```

Backend:

```text
Enforce authorization
```

---

# 53. Destructive Actions

Operations such as:

* deleting products
* deleting categories
* deleting users
* destructive stock adjustments

should require appropriate authorization and, where appropriate, confirmation.

Do not allow destructive actions accidentally through normal UI interactions.

---

# 54. Data Integrity

Protect relationships and constraints.

For example:

* SKU must be unique.
* Product must reference a valid category when required.
* Stock quantities must follow business rules.
* Users must have valid roles.
* Foreign keys must remain consistent.

Do not rely entirely on frontend logic to maintain data integrity.

---

# 55. Empty States

Pages that display collections should handle empty data gracefully.

Example:

```text
No products found.
```

Do not leave users with a completely blank table or page.

Use the application's existing empty-state component/pattern if one exists.

---

# 56. Loading and Processing States

Forms and asynchronous actions should communicate their state.

For example:

```text
Save
Saving...
```

Do not allow users to accidentally submit the same operation multiple times.

Reuse the existing Inertia processing state rather than introducing unnecessary custom loading state.

---

# 57. Accessibility

Use semantic HTML where appropriate.

Buttons should be buttons.

Links should be links.

Inputs should have associated labels.

Do not rely solely on color to communicate status.

Use accessible labels for icon-only actions.

Prefer existing accessible shadcn/ui components.

---

# 58. Responsive Design

The application should remain usable on common desktop and tablet/mobile screen sizes where appropriate.

Do not create separate implementations for mobile unless necessary.

Use the existing responsive Tailwind patterns.

---

# 59. No Unnecessary Rewrites

Do not rewrite an entire file to make a small change.

Make the smallest safe change that solves the requirement.

Preserve working behavior unless the task explicitly requires changing it.

---

# 60. No Unrelated Changes

When implementing a feature, do not simultaneously:

* rename unrelated variables
* redesign unrelated pages
* change unrelated database schemas
* replace libraries
* reorganize the entire project
* rewrite unrelated components

Keep the change focused.

---

# 61. When Requirements Are Ambiguous

If a requirement affects:

* permissions
* database behavior
* destructive operations
* business rules
* data integrity

do not silently make a major assumption.

Use the existing project conventions when the intended behavior is obvious.

If the behavior materially affects the business workflow, ask for clarification.

---

# 62. Migration Rules

Never modify an already-applied migration simply to change the database.

Create a new migration for schema changes when the migration has already been used.

Only modify an existing migration when working in an early development state where the migration has not been applied/shared and the project convention permits it.

---

# 63. Seeder Rules

Seeders should create predictable development data.

Do not hardcode production-specific IDs.

Use model factories where appropriate.

Roles and permissions should be created consistently and should not be duplicated on every seeding operation.

Use `firstOrCreate`, `updateOrCreate`, or equivalent patterns where appropriate for repeatable seeders.

---

# 64. Environment Configuration

Environment-specific configuration belongs in `.env`.

Examples:

```text
database credentials
API keys
application URLs
third-party credentials
environment-specific settings
```

Never hardcode secrets in source code.

Never commit secrets.

---

# 65. Git Rules

Before making changes:

* inspect the current branch
* inspect relevant changes when necessary
* avoid overwriting unrelated work

Do not reset, revert, or delete user changes unless explicitly requested.

Do not perform destructive Git operations without confirmation.

---

# 66. Code Quality Checklist

Before considering a change complete, verify:

* No unnecessary files were created.
* No unnecessary dependencies were added.
* Existing components were reused where appropriate.
* Existing styles were followed.
* No unnecessary hardcoded values were introduced.
* Backend validation exists.
* Backend authorization exists.
* TypeScript types are correct.
* No obvious `any` usage was introduced.
* No unused imports remain.
* No dead code remains.
* No obvious N+1 queries were introduced.
* UI matches existing application patterns.
* Permissions match the role model.
* Destructive operations are protected.
* Existing functionality was not unintentionally broken.

---

# 67. Final Development Rule

When deciding between two implementations, prefer the implementation that is:

1. Correct
2. Secure
3. Simple
4. Consistent with the existing project
5. Easy to understand
6. Easy to maintain
7. Easy to extend

Do not optimize for architectural complexity.

Do not introduce patterns merely because they are considered "best practice" in isolation.

The best implementation is the one that fits this project.

> **Reuse before creating.**
>
> **Refactor before duplicating.**
>
> **Keep business rules on the backend.**
>
> **Keep authorization on the backend.**
>
> **Follow existing styles.**
>
> **Avoid hardcoding.**
>
> **Avoid over-engineering.**
>
> **Make the smallest safe change.**
