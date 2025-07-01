"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var oas_1 = __importDefault(require("oas"));
var core_1 = __importDefault(require("api/dist/core"));
var openapi_json_1 = __importDefault(require("./openapi.json"));
var SDK = /** @class */ (function () {
    function SDK() {
        this.spec = oas_1.default.init(openapi_json_1.default);
        this.core = new core_1.default(this.spec, 'clickup/2.0 (api/6.1.3)');
    }
    /**
     * Optionally configure various options that the SDK allows.
     *
     * @param config Object of supported SDK options and toggles.
     * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
     * should be represented in milliseconds.
     */
    SDK.prototype.config = function (config) {
        this.core.setConfig(config);
    };
    /**
     * If the API you're using requires authentication you can supply the required credentials
     * through this method and the library will magically determine how they should be used
     * within your API request.
     *
     * With the exception of OpenID and MutualTLS, it supports all forms of authentication
     * supported by the OpenAPI specification.
     *
     * @example <caption>HTTP Basic auth</caption>
     * sdk.auth('username', 'password');
     *
     * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
     * sdk.auth('myBearerToken');
     *
     * @example <caption>API Keys</caption>
     * sdk.auth('myApiKey');
     *
     * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
     * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
     * @param values Your auth credentials for the API; can specify up to two strings or numbers.
     */
    SDK.prototype.auth = function () {
        var _a;
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        (_a = this.core).setAuth.apply(_a, values);
        return this;
    };
    /**
     * If the API you're using offers alternate server URLs, and server variables, you can tell
     * the SDK which one to use with this method. To use it you can supply either one of the
     * server URLs that are contained within the OpenAPI definition (along with any server
     * variables), or you can pass it a fully qualified URL to use (that may or may not exist
     * within the OpenAPI definition).
     *
     * @example <caption>Server URL with server variables</caption>
     * sdk.server('https://{region}.api.example.com/{basePath}', {
     *   name: 'eu',
     *   basePath: 'v14',
     * });
     *
     * @example <caption>Fully qualified server URL</caption>
     * sdk.server('https://eu.api.example.com/v14');
     *
     * @param url Server URL
     * @param variables An object of variables to replace into the server URL.
     */
    SDK.prototype.server = function (url, variables) {
        if (variables === void 0) { variables = {}; }
        this.core.setServer(url, variables);
    };
    /**
     * Upload a file to a task as an attachment. Files stored in the cloud cannot be used in
     * this API request.\
     *  \
     * ***Note:** This request uses multipart/form-data as the content type.*
     *
     * @summary Create Task Attachment
     */
    SDK.prototype.createTaskAttachment = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/attachment', 'post', body, metadata);
    };
    /**
     * These are the routes for authing the API and going through the [OAuth
     * flow](doc:authentication).\
     *  \
     * Applications utilizing a personal API token don't use this endpoint.\
     *  \
     * ***Note:** OAuth tokens are not supported when using the [**Try It**
     * feature](doc:trytheapi) of our Reference docs. You can't try this endpoint from your web
     * browser.*
     *
     * @summary Get Access Token
     */
    SDK.prototype.getAccessToken = function (metadata) {
        return this.core.fetch('/v2/oauth/token', 'post', metadata);
    };
    /**
     * View the details of the authenticated user's ClickUp account.
     *
     * @summary Get Authorized User
     */
    SDK.prototype.getAuthorizedUser = function () {
        return this.core.fetch('/v2/user', 'get');
    };
    /**
     * View the Workspaces available to the authenticated user.
     *
     * @summary Get Authorized Workspaces
     */
    SDK.prototype.getAuthorizedTeams = function () {
        return this.core.fetch('/v2/team', 'get');
    };
    /**
     * Add a new checklist to a task.
     *
     * @summary Create Checklist
     */
    SDK.prototype.createChecklist = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/checklist', 'post', body, metadata);
    };
    /**
     * Rename a task checklist, or reorder a checklist so it appears above or below other
     * checklists on a task.
     *
     * @summary Edit Checklist
     */
    SDK.prototype.editChecklist = function (body, metadata) {
        return this.core.fetch('/v2/checklist/{checklist_id}', 'put', body, metadata);
    };
    /**
     * Delete a checklist from a task.
     *
     * @summary Delete Checklist
     */
    SDK.prototype.deleteChecklist = function (metadata) {
        return this.core.fetch('/v2/checklist/{checklist_id}', 'delete', metadata);
    };
    /**
     * Add a line item to a task checklist.
     *
     * @summary Create Checklist Item
     */
    SDK.prototype.createChecklistItem = function (body, metadata) {
        return this.core.fetch('/v2/checklist/{checklist_id}/checklist_item', 'post', body, metadata);
    };
    /**
     * Update an individual line item in a task checklist. \
     *  \
     * You can rename it, set the assignee, mark it as resolved, or nest it under another
     * checklist item.
     *
     * @summary Edit Checklist Item
     */
    SDK.prototype.editChecklistItem = function (body, metadata) {
        return this.core.fetch('/v2/checklist/{checklist_id}/checklist_item/{checklist_item_id}', 'put', body, metadata);
    };
    /**
     * Delete a line item from a task checklist.
     *
     * @summary Delete Checklist Item
     */
    SDK.prototype.deleteChecklistItem = function (metadata) {
        return this.core.fetch('/v2/checklist/{checklist_id}/checklist_item/{checklist_item_id}', 'delete', metadata);
    };
    /**
     * View task comments. \
     *  \
     * If you do not include the `start` and `start_id` parameters, this endpoint will return
     * the most recent 25 comments.\
     *  \
     * Use the `start` and `start id` parameters of the oldest comment to retrieve the next 25
     * comments.
     *
     * @summary Get Task Comments
     */
    SDK.prototype.getTaskComments = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/comment', 'get', metadata);
    };
    /**
     * Add a new comment to a task.
     *
     * @summary Create Task Comment
     */
    SDK.prototype.createTaskComment = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/comment', 'post', body, metadata);
    };
    /**
     * View comments from a Chat view. \
     *  \
     * If you do not include the `start` and `start_id` parameters, this endpoint will return
     * the most recent 25 comments.\
     *  \
     * Use the `start` and `start id` parameters of the oldest comment to retrieve the next 25
     * comments.
     *
     * @summary Get Chat View Comments
     */
    SDK.prototype.getChatViewComments = function (metadata) {
        return this.core.fetch('/v2/view/{view_id}/comment', 'get', metadata);
    };
    /**
     * Add a new comment to a Chat view.
     *
     * @summary Create Chat View Comment
     */
    SDK.prototype.createChatViewComment = function (body, metadata) {
        return this.core.fetch('/v2/view/{view_id}/comment', 'post', body, metadata);
    };
    /**
     * View the comments added to a List. \
     *  \
     * If you do not include the `start` and `start_id` parameters, this endpoint will return
     * the most recent 25 comments.\
     *  \
     * Use the `start` and `start id` parameters of the oldest comment to retrieve the next 25
     * comments.
     *
     * @summary Get List Comments
     */
    SDK.prototype.getListComments = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/comment', 'get', metadata);
    };
    /**
     * Add a comment to a List.
     *
     * @summary Create List Comment
     */
    SDK.prototype.createListComment = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}/comment', 'post', body, metadata);
    };
    /**
     * Replace the content of a task commment, assign a comment, and mark a comment as
     * resolved.
     *
     * @summary Update Comment
     */
    SDK.prototype.updateComment = function (body, metadata) {
        return this.core.fetch('/v2/comment/{comment_id}', 'put', body, metadata);
    };
    /**
     * Delete a task comment.
     *
     * @summary Delete Comment
     */
    SDK.prototype.deleteComment = function (metadata) {
        return this.core.fetch('/v2/comment/{comment_id}', 'delete', metadata);
    };
    /**
     * View threaded comments. The parent comment is not included.
     *
     * @summary Get Threaded Comments
     */
    SDK.prototype.getThreadedComments = function (metadata) {
        return this.core.fetch('/v2/comment/{comment_id}/reply', 'get', metadata);
    };
    /**
     * Create a threaded comment.
     *
     * @summary Create Threaded Comment
     */
    SDK.prototype.createThreadedComment = function (body, metadata) {
        return this.core.fetch('/v2/comment/{comment_id}/reply', 'post', body, metadata);
    };
    /**
     * View the Custom Fields you have access to in a specific List.
     *
     * @summary Get List Custom Fields
     */
    SDK.prototype.getAccessibleCustomFields = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/field', 'get', metadata);
    };
    /**
     * View the Custom Fields you have access to in a specific Folder. Get Folder Custom Fields
     * only returns Custom Fields created at the Folder level. Custom Fields created at the
     * List level are not included.
     *
     * @summary Get Folder Custom Fields
     */
    SDK.prototype.getFolderAvailableFields = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/field', 'get', metadata);
    };
    /**
     * View the Custom Fields you have access to in a specific Space. Get Space Custom Fields
     * only returns Custom Fields created at the Space level. Custom Fields created at the
     * Folder and List level are not included.
     *
     * @summary Get Space Custom Fields
     */
    SDK.prototype.getSpaceAvailableFields = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}/field', 'get', metadata);
    };
    /**
     * View the Custom Fields you have access to in a specific Workspace. Get Workspace Custom
     * Fields only returns Custom Fields created at the Workspace level. Custom Fields created
     * at the Space, Folder, and List level are not included.
     *
     * @summary Get Workspace Custom Fields
     */
    SDK.prototype.getTeamAvailableFields = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/field', 'get', metadata);
    };
    /**
     * Add data to a Custom field on a task. \
     *  \
     * You'll need to know the `task_id` of the task you want to update, and the universal
     * unique identifier (UUID) `field_id` of the Custom Field you want to set. \
     *  \
     * You can use [Get Accessible Custom Fields](ref:getaccessiblecustomfields) or the [Get
     * Task](ref:gettask) endpoint to find the `field_id`.
     *
     * @summary Set Custom Field Value
     */
    SDK.prototype.setCustomFieldValue = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/field/{field_id}', 'post', body, metadata);
    };
    /**
     * Remove the data from a Custom Field on a task. This does not delete the option from the
     * Custom Field.
     *
     * @summary Remove Custom Field Value
     */
    SDK.prototype.removeCustomFieldValue = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/field/{field_id}', 'delete', metadata);
    };
    /**
     * Set a task as waiting on or blocking another task.
     *
     * @summary Add Dependency
     */
    SDK.prototype.addDependency = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/dependency', 'post', body, metadata);
    };
    /**
     * Remove the dependency relationship between two or more tasks.
     *
     * @summary Delete Dependency
     */
    SDK.prototype.deleteDependency = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/dependency', 'delete', metadata);
    };
    /**
     * This is the equivalent of the feature _Task Links_ in the right-hand sidebar of a Task.
     * It allows you to link two tasks together. General links or links to other objects than
     * tasks are not supported.
     *
     * @summary Add Task Link
     */
    SDK.prototype.addTaskLink = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/link/{links_to}', 'post', metadata);
    };
    /**
     * Remove the link between two tasks.
     *
     * @summary Delete Task Link
     */
    SDK.prototype.deleteTaskLink = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/link/{links_to}', 'delete', metadata);
    };
    /**
     * View the Folders in a Space.
     *
     * @summary Get Folders
     */
    SDK.prototype.getFolders = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}/folder', 'get', metadata);
    };
    /**
     * Add a new Folder to a Space.
     *
     * @summary Create Folder
     */
    SDK.prototype.createFolder = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/folder', 'post', body, metadata);
    };
    /**
     * View the Lists within a Folder.
     *
     * @summary Get Folder
     */
    SDK.prototype.getFolder = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}', 'get', metadata);
    };
    /**
     * Rename a Folder.
     *
     * @summary Update Folder
     */
    SDK.prototype.updateFolder = function (body, metadata) {
        return this.core.fetch('/v2/folder/{folder_id}', 'put', body, metadata);
    };
    /**
     * Delete a Folder from your Workspace.
     *
     * @summary Delete Folder
     */
    SDK.prototype.deleteFolder = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}', 'delete', metadata);
    };
    /**
     * View the Goals available in a Workspace.
     *
     * @summary Get Goals
     */
    SDK.prototype.getGoals = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/goal', 'get', metadata);
    };
    /**
     * Add a new Goal to a Workspace.
     *
     * @summary Create Goal
     */
    SDK.prototype.createGoal = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/goal', 'post', body, metadata);
    };
    /**
     * View the details of a Goal including its Targets.
     *
     * @summary Get Goal
     */
    SDK.prototype.getGoal = function (metadata) {
        return this.core.fetch('/v2/goal/{goal_id}', 'get', metadata);
    };
    /**
     * Rename a Goal, set the due date, replace the description, add or remove owners, and set
     * the Goal color.
     *
     * @summary Update Goal
     */
    SDK.prototype.updateGoal = function (body, metadata) {
        return this.core.fetch('/v2/goal/{goal_id}', 'put', body, metadata);
    };
    /**
     * Remove a Goal from your Workspace.
     *
     * @summary Delete Goal
     */
    SDK.prototype.deleteGoal = function (metadata) {
        return this.core.fetch('/v2/goal/{goal_id}', 'delete', metadata);
    };
    /**
     * Add a Target to a Goal.
     *
     * @summary Create Key Result
     */
    SDK.prototype.createKeyResult = function (body, metadata) {
        return this.core.fetch('/v2/goal/{goal_id}/key_result', 'post', body, metadata);
    };
    /**
     * Update a Target.
     *
     * @summary Edit Key Result
     */
    SDK.prototype.editKeyResult = function (body, metadata) {
        return this.core.fetch('/v2/key_result/{key_result_id}', 'put', body, metadata);
    };
    /**
     * Delete a target from a Goal.
     *
     * @summary Delete Key Result
     */
    SDK.prototype.deleteKeyResult = function (metadata) {
        return this.core.fetch('/v2/key_result/{key_result_id}', 'delete', metadata);
    };
    /**
     * Invite a guest to join a Workspace. To invite a member to your Workspace, use the
     * [Invite User to Workspace](ref:inviteusertoworkspace) endpoint. \
     *  \
     * You'll also need to grant the guest access to specific items using the following
     * endpoints: [Add Guest to Folder](ref:addguesttofolder), [Add Guest to
     * List](ref:addguesttolist), or [Add Guest to Task](ref:addguesttotask). \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Invite Guest To Workspace
     */
    SDK.prototype.inviteGuestToWorkspace = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/guest', 'post', body, metadata);
    };
    /**
     * View information about a guest. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Get Guest
     */
    SDK.prototype.getGuest = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/guest/{guest_id}', 'get', metadata);
    };
    SDK.prototype.editGuestOnWorkspace = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/guest/{guest_id}', 'put', body, metadata);
    };
    /**
     * Revoke a guest's access to a Workspace. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Remove Guest From Workspace
     */
    SDK.prototype.removeGuestFromWorkspace = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/guest/{guest_id}', 'delete', metadata);
    };
    /**
     * Share a task with a guest. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Add Guest To Task
     */
    SDK.prototype.addGuestToTask = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/guest/{guest_id}', 'post', body, metadata);
    };
    /**
     * Revoke a guest's access to a task. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Remove Guest From Task
     */
    SDK.prototype.removeGuestFromTask = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/guest/{guest_id}', 'delete', metadata);
    };
    /**
     * Share a List with a guest. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Add Guest To List
     */
    SDK.prototype.addGuestToList = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}/guest/{guest_id}', 'post', body, metadata);
    };
    /**
     * Revoke a guest's access to a List.\
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Remove Guest From List
     */
    SDK.prototype.removeGuestFromList = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/guest/{guest_id}', 'delete', metadata);
    };
    /**
     * Share a Folder with a guest. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Add Guest To Folder
     */
    SDK.prototype.addGuestToFolder = function (body, metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/guest/{guest_id}', 'post', body, metadata);
    };
    /**
     * Revoke a guest's access to a Folder. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Remove Guest From Folder
     */
    SDK.prototype.removeGuestFromFolder = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/guest/{guest_id}', 'delete', metadata);
    };
    /**
     * View the Lists within a Folder.
     *
     * @summary Get Lists
     */
    SDK.prototype.getLists = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/list', 'get', metadata);
    };
    /**
     * Add a new List to a Folder.
     *
     * @summary Create List
     */
    SDK.prototype.createList = function (body, metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/list', 'post', body, metadata);
    };
    /**
     * Create a new Folder using a Folder template within a Space. This endpoint allows you to
     * create a folder with all its nested assets (lists, tasks, etc.) from a predefined
     * template.
     * This request can be run asynchronously or synchronously via the `return_immediately`
     * parameter.
     *
     * @summary Create Folder from template
     * @throws FetchError<400, types.CreateFolderFromTemplateResponse400> Bad request - Name is required
     */
    SDK.prototype.createFolderFromTemplate = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/folder_template/{template_id}', 'post', body, metadata);
    };
    /**
     * View the Lists in a Space that aren't located in a Folder.
     *
     * @summary Get Folderless Lists
     */
    SDK.prototype.getFolderlessLists = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}/list', 'get', metadata);
    };
    /**
     * Add a new List in a Space.
     *
     * @summary Create Folderless List
     */
    SDK.prototype.createFolderlessList = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/list', 'post', body, metadata);
    };
    /**
     * View information about a List.
     *
     * @summary Get List
     */
    SDK.prototype.getList = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}', 'get', metadata);
    };
    /**
     * Rename a List, update the List Info description, set a due date/time, set the List's
     * priority, set an assignee, set or remove the List color.
     *
     * @summary Update List
     */
    SDK.prototype.updateList = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}', 'put', body, metadata);
    };
    /**
     * Delete a List from your Workspace.
     *
     * @summary Delete List
     */
    SDK.prototype.deleteList = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}', 'delete', metadata);
    };
    /**
     * Add a task to an additional List. \
     *  \
     * ***Note:** This endpoint requires the [Tasks in Multiple List
     * ClickApp](https://help.clickup.com/hc/en-us/articles/6309958824727-Tasks-in-Multiple-Lists)
     * to be enabled.*
     *
     * @summary Add Task To List
     */
    SDK.prototype.addTaskToList = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/task/{task_id}', 'post', metadata);
    };
    /**
     * Remove a task from an additional List. You can't remove a task from its home List. \
     *  \
     * ***Note:** This endpoint requires the [Tasks in Multiple List
     * ClickApp](https://help.clickup.com/hc/en-us/articles/6309958824727-Tasks-in-Multiple-Lists)
     * to be enabled.*
     *
     * @summary Remove Task From List
     */
    SDK.prototype.removeTaskFromList = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/task/{task_id}', 'delete', metadata);
    };
    /**
     * View the people who have access to a task. Responses do not include people with
     * inherited Hierarchy permission to the task.
     *
     * @summary Get Task Members
     */
    SDK.prototype.getTaskMembers = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/member', 'get', metadata);
    };
    /**
     * Get Workspace members who have access to a List.
     *
     * @summary Get List Members
     */
    SDK.prototype.getListMembers = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/member', 'get', metadata);
    };
    /**
     * View the Custom Roles available in a Workspace.
     *
     * @summary Get Custom Roles
     */
    SDK.prototype.getCustomRoles = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/customroles', 'get', metadata);
    };
    /**
     * View the tasks, Lists, and Folders that have been shared with the authenticated user.
     *
     * @summary Shared Hierarchy
     */
    SDK.prototype.sharedHierarchy = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/shared', 'get', metadata);
    };
    /**
     * View the Spaces avialable in a Workspace. You can only get member info in private
     * Spaces.
     *
     * @summary Get Spaces
     */
    SDK.prototype.getSpaces = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/space', 'get', metadata);
    };
    /**
     * Add a new Space to a Workspace.
     *
     * @summary Create Space
     */
    SDK.prototype.createSpace = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/space', 'post', body, metadata);
    };
    /**
     * View the Spaces available in a Workspace.
     *
     * @summary Get Space
     */
    SDK.prototype.getSpace = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}', 'get', metadata);
    };
    /**
     * Rename, set the Space color, and enable ClickApps for a Space.
     *
     * @summary Update Space
     */
    SDK.prototype.updateSpace = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}', 'put', body, metadata);
    };
    /**
     * Delete a Space from your Workspace.
     *
     * @summary Delete Space
     */
    SDK.prototype.deleteSpace = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}', 'delete', metadata);
    };
    /**
     * View the task Tags available in a Space.
     *
     * @summary Get Space Tags
     */
    SDK.prototype.getSpaceTags = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}/tag', 'get', metadata);
    };
    /**
     * Add a new task Tag to a Space.
     *
     * @summary Create Space Tag
     */
    SDK.prototype.createSpaceTag = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/tag', 'post', body, metadata);
    };
    /**
     * Update a task Tag.
     *
     * @summary Edit Space Tag
     */
    SDK.prototype.editSpaceTag = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/tag/{tag_name}', 'put', body, metadata);
    };
    /**
     * Delete a task Tag from a Space.
     *
     * @summary Delete Space Tag
     */
    SDK.prototype.deleteSpaceTag = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/tag/{tag_name}', 'delete', body, metadata);
    };
    /**
     * Add a Tag to a task.
     *
     * @summary Add Tag To Task
     */
    SDK.prototype.addTagToTask = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/tag/{tag_name}', 'post', metadata);
    };
    /**
     * Remove a Tag from a task. This does not delete the Tag from the Space.
     *
     * @summary Remove Tag From Task
     */
    SDK.prototype.removeTagFromTask = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/tag/{tag_name}', 'delete', metadata);
    };
    /**
     * View the tasks in a List. Responses are limited to 100 tasks per page. You can only view
     * task information of tasks you can access. \
     *  \
     * This endpoint only includes tasks where the specified `list_id` is their home List.
     * Tasks added to the `list_id` with a different home List are not included in the
     * response.
     *
     * @summary Get Tasks
     */
    SDK.prototype.getTasks = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/task', 'get', metadata);
    };
    /**
     * Create a new task.
     *
     * @summary Create Task
     */
    SDK.prototype.createTask = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}/task', 'post', body, metadata);
    };
    /**
     * View information about a task. You can only view task information of tasks you can
     * access. \
     *  \
     * Tasks with attachments will return an "attachments" response. \
     *  \
     * Docs attached to a task are not returned.
     *
     * @summary Get Task
     */
    SDK.prototype.getTask = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}', 'get', metadata);
    };
    /**
     * Update a task by including one or more fields in the request body.
     *
     * @summary Update Task
     */
    SDK.prototype.updateTask = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}', 'put', body, metadata);
    };
    /**
     * Delete a task from your Workspace.
     *
     * @summary Delete Task
     */
    SDK.prototype.deleteTask = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}', 'delete', metadata);
    };
    /**
     * View the tasks that meet specific criteria from a Workspace. Responses are limited to
     * 100 tasks per page.  \
     *  \
     * You can only view task information of tasks you can access. \
     *  \
     *  Our Try It modal currently supports filtering by two or more Lists, Folders, or Spaces.
     * To filter by a single List, Folder, or Space, we recommend using a free app like
     * [Postman](https://www.postman.com/) to test our public API.
     *
     * @summary Get Filtered Team Tasks
     */
    SDK.prototype.getFilteredTeamTasks = function (metadata) {
        return this.core.fetch('/v2/team/{team_Id}/task', 'get', metadata);
    };
    /**
     * Merge multiple tasks into a target task. The target task is specified by the task_id
     * parameter, while the source tasks to be merged are provided in the request body. Custom
     * Task IDs are not supported.
     *
     * @summary Merge Tasks
     */
    SDK.prototype.mergeTasks = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/merge', 'post', body, metadata);
    };
    /**
     * View how long a task has been in each status. The Total time in Status ClickApp must
     * first be enabled by the Workspace owner or an admin.
     *
     * @summary Get Task's Time in Status
     */
    SDK.prototype.getTaskSTimeinStatus = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/time_in_status', 'get', metadata);
    };
    /**
     * View how long two or more tasks have been in each status. The Total time in Status
     * ClickApp must first be enabled by the Workspace owner or an admin.
     *
     * @summary Get Bulk Tasks' Time in Status
     */
    SDK.prototype.getBulkTasksTimeinStatus = function (metadata) {
        return this.core.fetch('/v2/task/bulk_time_in_status/task_ids', 'get', metadata);
    };
    /**
     * View the task templates available in a Workspace.
     *
     * @summary Get Task Templates
     */
    SDK.prototype.getTaskTemplates = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/taskTemplate', 'get', metadata);
    };
    /**
     * Create a new task using a task template.
     *
     * @summary Create Task From Template
     */
    SDK.prototype.createTaskFromTemplate = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}/taskTemplate/{template_id}', 'post', body, metadata);
    };
    /**
     * Create a new list using a list template in a folder
     * This request runs synchronously by default with `return_immediately=true`. The request
     * returns the future List ID immediatly, but the List might not created at the time of the
     * request returning.
     * Small temmplates can be applied syncronously, which guarantees that all sub objects are
     * created. In case of a timeout on syncronous requests, the of objects from the template
     * will continue to be created past the timeout.
     *
     * @summary Create List From Template in Folder
     * @throws FetchError<400, types.CreateFolderListFromTemplateResponse400> Bad request - Name is required
     */
    SDK.prototype.createFolderListFromTemplate = function (body, metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/list_template/{template_id}', 'post', body, metadata);
    };
    /**
     * Create a new List using a List template within a Space.
     * This request can be run asynchronously or synchronously via the `return_immediately`
     * parameter.
     *
     * @summary Create List From Template in Space.
     * @throws FetchError<400, types.CreateSpaceListFromTemplateResponse400> Bad request - Name is required, or is already taken
     */
    SDK.prototype.createSpaceListFromTemplate = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/list_template/{template_id}', 'post', body, metadata);
    };
    /**
     * View the used, total, and available member and guest seats for a Workspace.
     *
     * @summary Get Workspace seats
     */
    SDK.prototype.getWorkspaceseats = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/seats', 'get', metadata);
    };
    /**
     * View the current [Plan](https://clickup.com/pricing) for the specified Workspace.
     *
     * @summary Get Workspace Plan
     */
    SDK.prototype.getWorkspaceplan = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/plan', 'get', metadata);
    };
    /**
     * This endpoint creates a [User
     * Group](https://docs.clickup.com/en/articles/4010016-teams-how-to-create-user-groups)
     * within a Workspace.\
     *  \
     * User Groups are used to organize and manage users within a Workspace.\
     *  \
     * In the API documentation, `team_id` refers to the Workspace ID, and `group_id` refers to
     * the User Group ID.\
     *  \
     * **Note:** Adding a guest with view-only permissions to a Team automatically converts
     * them to a paid guest.\
     *  \
     * If no paid guest seats are available, an additional member seat will be added,
     * increasing the number of paid guest seats.\
     *  \
     * This change incurs a prorated charge based on the billing cycle.
     *
     * @summary Create Group
     */
    SDK.prototype.createUserGroup = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/group', 'post', body, metadata);
    };
    /**
     * View the custom task types available in a Workspace.
     *
     * @summary Get Custom Task Types
     */
    SDK.prototype.getCustomItems = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/custom_item', 'get', metadata);
    };
    /**
     * This endpoint is used to manage [User
     * Groups](https://docs.clickup.com/en/articles/4010016-teams-how-to-create-user-groups),
     * which are groups of users within your Workspace.\
     *  \
     * In our API, `team_id` in the path refers to the Workspace ID, and `group_id` refers to
     * the ID of a User Group.\
     *  \
     * **Note:** Adding a guest with view-only permissions to a User Group automatically
     * converts them to a paid guest.\
     *  \
     * If you don't have any paid guest seats available, a new member seat is automatically
     * added to increase the number of paid guest seats.\
     *  \
     * This incurs a prorated charge based on your billing cycle.
     *
     * @summary Update Group
     */
    SDK.prototype.updateTeam = function (body, metadata) {
        return this.core.fetch('/v2/group/{group_id}', 'put', body, metadata);
    };
    /**
     * This endpoint is used to remove a [User
     * Group](https://docs.clickup.com/en/articles/4010016-teams-how-to-create-user-groups)
     * from your Workspace.\
     *  \
     * In our API documentation, `team_id` refers to the id of a Workspace, and `group_id`
     * refers to the id of a user group.
     *
     * @summary Delete Group
     */
    SDK.prototype.deleteTeam = function (metadata) {
        return this.core.fetch('/v2/group/{group_id}', 'delete', metadata);
    };
    /**
     * This endpoint is used to view [User
     * Groups](https://docs.clickup.com/en/articles/4010016-teams-how-to-create-user-groups) in
     * your Workspace.\
     *  \
     * In our API documentation, `team_id` refers to the ID of a Workspace, and `group_id`
     * refers to the ID of a User Group.
     *
     * @summary Get Groups
     */
    SDK.prototype.getTeams1 = function (metadata) {
        return this.core.fetch('/v2/group', 'get', metadata);
    };
    /**
     * ***Note:** This is a legacy time tracking endpoint. We recommend using the Time Tracking
     * API endpoints to manage time entries.*
     *
     * @summary Get tracked time
     */
    SDK.prototype.gettrackedtime = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/time', 'get', metadata);
    };
    /**
     * ***Note:** This is a legacy time tracking endpoint. We recommend using the Time Tracking
     * API endpoints to manage time entries.*
     *
     * @summary Track time
     */
    SDK.prototype.tracktime = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/time', 'post', body, metadata);
    };
    /**
     * ***Note:** This is a legacy time tracking endpoint. We recommend using the Time Tracking
     * API endpoints to manage time entries.*
     *
     * @summary Edit time tracked
     */
    SDK.prototype.edittimetracked = function (body, metadata) {
        return this.core.fetch('/v2/task/{task_id}/time/{interval_id}', 'put', body, metadata);
    };
    /**
     * ***Note:** This is a legacy time tracking endpoint. We recommend using the Time Tracking
     * API endpoints to manage time entries.*
     *
     * @summary Delete time tracked
     */
    SDK.prototype.deletetimetracked = function (metadata) {
        return this.core.fetch('/v2/task/{task_id}/time/{interval_id}', 'delete', metadata);
    };
    /**
     * View time entries filtered by start and end date. \
     *  \
     * By default, this endpoint returns time entries from the last 30 days created by the
     * authenticated user. \
     *  \
     * To retrieve time entries for other users, you must include the `assignee` query
     * parameter. \
     *  \
     * Only one of the following location filters can be included at a time: `space_id`,
     * `folder_id`, `list_id`, or `task_id`. \
     *  \
     * ***Note:** A time entry that has a negative duration means that timer is currently
     * running for that user.*
     *
     * @summary Get time entries within a date range
     */
    SDK.prototype.gettimeentrieswithinadaterange = function (metadata) {
        return this.core.fetch('/v2/team/{team_Id}/time_entries', 'get', metadata);
    };
    /**
     * Create a time entry. \
     *  \
     * ***Note:** A time entry that has a negative duration means that timer is currently
     * running for that user.*
     *
     * @summary Create a time entry
     */
    SDK.prototype.createatimeentry = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_Id}/time_entries', 'post', body, metadata);
    };
    /**
     * View a single time entry. \
     *  \
     * ***Note:** A time entry that has a negative duration means that timer is currently
     * running for that user.*
     *
     * @summary Get singular time entry
     */
    SDK.prototype.getsingulartimeentry = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/{timer_id}', 'get', metadata);
    };
    /**
     * Delete a time entry from a Workspace.
     *
     * @summary Delete a time Entry
     */
    SDK.prototype.deleteatimeEntry = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/{timer_id}', 'delete', metadata);
    };
    /**
     * Update the details of a time entry.
     *
     * @summary Update a time Entry
     */
    SDK.prototype.updateatimeEntry = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/{timer_id}', 'put', body, metadata);
    };
    /**
     * View a list of changes made to a time entry.
     *
     * @summary Get time entry history
     */
    SDK.prototype.gettimeentryhistory = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/{timer_id}/history', 'get', metadata);
    };
    /**
     * View a time entry that's currently tracking time for the authenticated user. \
     *  \
     * ***Note:** A time entry that has a negative duration means that timer is currently
     * running for that user.*
     *
     * @summary Get running time entry
     */
    SDK.prototype.getrunningtimeentry = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/current', 'get', metadata);
    };
    /**
     * Remove labels from time entries. This does not remove the label from a Workspace.
     *
     * @summary Remove tags from time entries
     */
    SDK.prototype.removetagsfromtimeentries = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/tags', 'delete', body, metadata);
    };
    /**
     * View all the labels that have been applied to time entries in a Workspace.
     *
     * @summary Get all tags from time entries
     */
    SDK.prototype.getalltagsfromtimeentries = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/tags', 'get', metadata);
    };
    /**
     * Add a label to a time entry.
     *
     * @summary Add tags from time entries
     */
    SDK.prototype.addtagsfromtimeentries = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/tags', 'post', body, metadata);
    };
    /**
     * Rename an time entry label.
     *
     * @summary Change tag names from time entries
     */
    SDK.prototype.changetagnamesfromtimeentries = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/tags', 'put', body, metadata);
    };
    /**
     * Start a timer for the authenticated user.
     *
     * @summary Start a time Entry
     */
    SDK.prototype.startatimeEntry = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_Id}/time_entries/start', 'post', body, metadata);
    };
    /**
     * Stop a timer that's currently running for the authenticated user.
     *
     * @summary Stop a time Entry
     */
    SDK.prototype.stopatimeEntry = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/time_entries/stop', 'post', metadata);
    };
    /**
     * Invite someone to join your Workspace as a member. To invite someone as a guest, use the
     * [Invite Guest](ref:inviteguesttoworkspace) endpoint.\
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Invite User To Workspace
     */
    SDK.prototype.inviteUserToWorkspace = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/user', 'post', body, metadata);
    };
    /**
     * View information about a user in a Workspace. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Get User
     */
    SDK.prototype.getUser = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/user/{user_id}', 'get', metadata);
    };
    /**
     * Update a user's name and role. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Edit User On Workspace
     */
    SDK.prototype.editUserOnWorkspace = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/user/{user_id}', 'put', body, metadata);
    };
    /**
     * Deactivate a user from a Workspace. \
     *  \
     * ***Note:** This endpoint is only available to Workspaces on our [Enterprise
     * Plan](https://clickup.com/pricing).*
     *
     * @summary Remove User From Workspace
     */
    SDK.prototype.removeUserFromWorkspace = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/user/{user_id}', 'delete', metadata);
    };
    /**
     * View the task and page views available at the Everything Level of a Workspace.
     *
     * @summary Get Workspace (Everything level) Views
     */
    SDK.prototype.getTeamViews = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/view', 'get', metadata);
    };
    /**
     * Add a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt
     * view at the Everything Level of a Workspace.
     *
     * @summary Create Workspace (Everything level) View
     */
    SDK.prototype.createTeamView = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/view', 'post', body, metadata);
    };
    /**
     * View the task and page views available for a Space.
     *
     * @summary Get Space Views
     */
    SDK.prototype.getSpaceViews = function (metadata) {
        return this.core.fetch('/v2/space/{space_id}/view', 'get', metadata);
    };
    /**
     * Add a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt
     * view to a Space.
     *
     * @summary Create Space View
     */
    SDK.prototype.createSpaceView = function (body, metadata) {
        return this.core.fetch('/v2/space/{space_id}/view', 'post', body, metadata);
    };
    /**
     * View the task and page views available for a Folder.
     *
     * @summary Get Folder Views
     */
    SDK.prototype.getFolderViews = function (metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/view', 'get', metadata);
    };
    /**
     * Add a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt
     * view to a Folder.
     *
     * @summary Create Folder View
     */
    SDK.prototype.createFolderView = function (body, metadata) {
        return this.core.fetch('/v2/folder/{folder_id}/view', 'post', body, metadata);
    };
    /**
     * View the task and page views available for a List.<br> Views and required views are
     * separate responses.
     *
     * @summary Get List Views
     */
    SDK.prototype.getListViews = function (metadata) {
        return this.core.fetch('/v2/list/{list_id}/view', 'get', metadata);
    };
    /**
     * Add a List, Board, Calendar, Table, Timeline, Workload, Activity, Map, Chat, or Gantt
     * view to a List.
     *
     * @summary Create List View
     */
    SDK.prototype.createListView = function (body, metadata) {
        return this.core.fetch('/v2/list/{list_id}/view', 'post', body, metadata);
    };
    /**
     * View information about a specific task or page view.
     *
     * @summary Get View
     */
    SDK.prototype.getView = function (metadata) {
        return this.core.fetch('/v2/view/{view_id}', 'get', metadata);
    };
    /**
     * Rename a view, update the grouping, sorting, filters, columns, and settings of a view.
     *
     * @summary Update View
     */
    SDK.prototype.updateView = function (body, metadata) {
        return this.core.fetch('/v2/view/{view_id}', 'put', body, metadata);
    };
    /**
     * Delete View
     *
     */
    SDK.prototype.deleteView = function (metadata) {
        return this.core.fetch('/v2/view/{view_id}', 'delete', metadata);
    };
    /**
     * See all visible tasks in a view in ClickUp.
     *
     * @summary Get View Tasks
     */
    SDK.prototype.getViewTasks = function (metadata) {
        return this.core.fetch('/v2/view/{view_id}/task', 'get', metadata);
    };
    /**
     * View the webhooks created via the API for a Workspace. This endpoint returns webhooks
     * created by the authenticated user.
     *
     * @summary Get Webhooks
     */
    SDK.prototype.getWebhooks = function (metadata) {
        return this.core.fetch('/v2/team/{team_id}/webhook', 'get', metadata);
    };
    /**
     * Set up a webhook to monitor for events.<br> We do not have a dedicated IP address for
     * webhooks. We use our domain name and dynamic addressing.
     *
     * @summary Create Webhook
     */
    SDK.prototype.createWebhook = function (body, metadata) {
        return this.core.fetch('/v2/team/{team_id}/webhook', 'post', body, metadata);
    };
    /**
     * Update a webhook to change the events to be monitored.
     *
     * @summary Update Webhook
     */
    SDK.prototype.updateWebhook = function (body, metadata) {
        return this.core.fetch('/v2/webhook/{webhook_id}', 'put', body, metadata);
    };
    /**
     * Delete a webhook to stop monitoring the events and locations of the webhook.
     *
     * @summary Delete Webhook
     */
    SDK.prototype.deleteWebhook = function (metadata) {
        return this.core.fetch('/v2/webhook/{webhook_id}', 'delete', metadata);
    };
    /**
     * View the Docs in your Workspace. You can only view information of Docs you can access.
     *
     * @summary Search Docs
     */
    SDK.prototype.searchDocs = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs', 'get', metadata);
    };
    /**
     * Create a new Doc.
     *
     * @summary Create Doc
     */
    SDK.prototype.createDoc = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs', 'post', body, metadata);
    };
    /**
     * View information about a Doc.
     *
     * @summary Get Doc
     */
    SDK.prototype.getDoc = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}', 'get', metadata);
    };
    /**
     * View the PageListing for a Doc.
     *
     * @summary Get Doc PageListing
     */
    SDK.prototype.getDocPageListing = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}/pageListing', 'get', metadata);
    };
    /**
     * View pages belonging to a Doc.
     *
     * @summary Get Doc pages
     */
    SDK.prototype.getDocPages = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}/pages', 'get', metadata);
    };
    /**
     * Create a page in a Doc.
     *
     * @summary Create page
     */
    SDK.prototype.createPage = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}/pages', 'post', body, metadata);
    };
    /**
     * View the information about a page in a Doc. Due to markdown format limitations, some
     * content elements [will not be displayed exactly as they appear in
     * ClickUp.](doc:docsimportexportlimitations/)
     *
     * @summary Get page
     */
    SDK.prototype.getPage = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}/pages/{pageId}', 'get', metadata);
    };
    /**
     * Edit a page in a Doc.
     *
     * @summary Edit page
     */
    SDK.prototype.editPage = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspaceId}/docs/{docId}/pages/{pageId}', 'put', body, metadata);
    };
    /**
     * Create Workspace-level audit logs. Audit logs can only be created by the Workspace owner
     * on Enterprise Plans.
     *
     * @summary Create Workspace-level audit logs
     */
    SDK.prototype.createWorkspaceAuditLog = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/auditlogs', 'post', body, metadata);
    };
    /**
     * Update the privacy and access settings of an object or location in the Workspace. Note
     * that sharing an item may incur charges.
     *
     * @summary Update privacy and access of an object or location
     */
    SDK.prototype.updatePrivacyAndAccess = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/{object_type}/{object_id}/acls', 'patch', body, metadata);
    };
    /**
     * This endpoint retrieves the Channels in a Workspace.
     *
     * @summary Retrieve Channels
     */
    SDK.prototype.getChatChannels = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels', 'get', metadata);
    };
    /**
     * This endpoint creates a new Channel not tied to a Space, Folder, or List. If a Channel
     * with the specified name already exists it returns it.
     *
     * @summary Create a Channel
     */
    SDK.prototype.createChatChannel = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels', 'post', body, metadata);
    };
    /**
     * This endpoint creates a Channel and when a Channel already exists on the requested
     * location, it returns it.
     *
     * @summary Create a Channel on a Space, Folder, or List
     */
    SDK.prototype.createLocationChatChannel = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/location', 'post', body, metadata);
    };
    /**
     * This endpoint creates a new Direct Message between up to 10 users. If a Direct Message
     * between those users already exists it returns it.
     *
     * @summary Create a Direct Message
     */
    SDK.prototype.createDirectMessageChatChannel = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/direct_message', 'post', body, metadata);
    };
    /**
     * This endpoint retrieves a specific Channel given its ID.
     *
     * @summary Retrieves a single Channel by ID.
     * @throws FetchError<404, types.GetChatChannelResponse404> Returns when the requested {channelId} was not found.
     */
    SDK.prototype.getChatChannel = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}', 'get', metadata);
    };
    /**
     * This endpoint updates a single Channel.
     *
     * @summary Update a Channel
     * @throws FetchError<400, types.UpdateChatChannelResponse400> Invalid update request for {channelId}.
     * @throws FetchError<404, types.UpdateChatChannelResponse404> Returns when the requested {channelId} was not found when updating a Channel
     */
    SDK.prototype.updateChatChannel = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}', 'patch', body, metadata);
    };
    /**
     * This endpoint deletes a Channel. Applies to Channels tied to a Space, Folder, or List or
     * not tied to locations.
     *
     * @summary Delete a Channel
     * @throws FetchError<404, types.DeleteChatChannelResponse404> Returns when the requested {channelId} was not found when deleting a Channel
     */
    SDK.prototype.deleteChatChannel = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}', 'delete', metadata);
    };
    /**
     * This endpoint retrieves followers of a specific Channel given its ID.
     *
     * @summary Retrieve followers of a Channel (based on Channel ID)
     * @throws FetchError<404, types.GetChatChannelFollowersResponse404> Returns when the specified {channelId} was not found.
     */
    SDK.prototype.getChatChannelFollowers = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/followers', 'get', metadata);
    };
    /**
     * This endpoint retrieves members of a specific Channel given its ID.
     *
     * @summary Retrieve members of a Channel (based on Channel ID)
     */
    SDK.prototype.getChatChannelMembers = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/members', 'get', metadata);
    };
    /**
     * This endpoint retrieves messages for a specified Channel.
     *
     * @summary Retrieve Channel messages
     * @throws FetchError<404, types.GetChatMessagesResponse404> Returns when the specified {channelId} was not found.
     */
    SDK.prototype.getChatMessages = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages', 'get', metadata);
    };
    /**
     * This endpoint creates a top level message.
     *
     * @summary Send a message
     * @throws FetchError<404, types.CreateChatMessageResponse404> Returns when {channelId} was not found.
     */
    SDK.prototype.createChatMessage = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/channels/{channel_id}/messages', 'post', body, metadata);
    };
    /**
     * This endpoint updates a message.
     *
     * @summary Update a message
     * @throws FetchError<400, types.PatchChatMessageResponse400> Returns when the request is invalid.
     * @throws FetchError<404, types.PatchChatMessageResponse404> Returns when {messageId} was not found.
     */
    SDK.prototype.patchChatMessage = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}', 'patch', body, metadata);
    };
    /**
     * This endpoint deletes a message.
     *
     * @summary Deletes a message.
     */
    SDK.prototype.deleteChatMessage = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}', 'delete', metadata);
    };
    /**
     * This endpoint retrieves reactions for a message
     *
     * @summary Retrieve reactions for a message
     * @throws FetchError<404, types.GetChatMessageReactionsResponse404> Returns when the specified {messageId} was not found
     */
    SDK.prototype.getChatMessageReactions = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/reactions', 'get', metadata);
    };
    /**
     * This endpoint creates a message reaction using lower case emoji names.
     *
     * @summary Create a message reaction
     * @throws FetchError<400, types.CreateChatReactionResponse400> Returns when the reaction {reaction} is not supported or already exists.
     * @throws FetchError<404, types.CreateChatReactionResponse404> Returns when the message {messageId} is not found.
     */
    SDK.prototype.createChatReaction = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/reactions', 'post', body, metadata);
    };
    /**
     * This endpoint deletes a message reaction.
     *
     * @summary Delete a message reaction
     * @throws FetchError<400, types.DeleteChatReactionResponse400> Returns when the reaction {reaction} is not supported.
     * @throws FetchError<404, types.DeleteChatReactionResponse404> Returns when the message {messageId} or the reaction {reaction} is not found.
     */
    SDK.prototype.deleteChatReaction = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/reactions/{reaction}', 'delete', metadata);
    };
    /**
     * This endpoint retrieves replies to a message.
     *
     * @summary Retrieve replies to a message
     * @throws FetchError<404, types.GetChatMessageRepliesResponse404> Returns when the specified {messageId} was not found.
     */
    SDK.prototype.getChatMessageReplies = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/replies', 'get', metadata);
    };
    /**
     * This endpoint creates a reply message.
     *
     * @summary Create a reply message
     */
    SDK.prototype.createReplyMessage = function (body, metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/replies', 'post', body, metadata);
    };
    /**
     * This endpoint retrieves tagged users for a message
     *
     * @summary Retrieve tagged users for a message
     * @throws FetchError<404, types.GetChatMessageTaggedUsersResponse404> Returns when the specified {messageId} was not found
     */
    SDK.prototype.getChatMessageTaggedUsers = function (metadata) {
        return this.core.fetch('/v3/workspaces/{workspace_id}/chat/messages/{message_id}/tagged_users', 'get', metadata);
    };
    return SDK;
}());
var createSDK = (function () { return new SDK(); })();
module.exports = createSDK;
