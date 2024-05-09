const getMethodInfo = method => {
    let methodsInfo = {
        onMessage: {
            args: ["reciverCallback(update)","options = getEvents()"],
            method: "onMessage",
            className: "Client"
        },
        getChatsUpdates: {
            args: ["state", "options = getEvents()"],
            method: "getChatsUpdates",
            className: "Client"
        },
        registerDevice: {
            args: ['appName = "TechCode"', "options = getEvents()"],
            method: "registerDevice",
            className: "Client"
        },
        requestSendFile: {
            args: ["fileName", "fileSize", "options = getEvents()"],
            method: "requestSendFile",
            className: "Client"
        },
        uploadFile: {
            args: ["fileData = {}", "buffer", "options = getEvents()"],
            method: "uploadFile",
            className: "Client"
        },
        sendPhoto: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendPhoto",
            className: "Client"
        },
        sendVideo: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendVideo",
            className: "Client"
        },
        sendMusic: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendMusic",
            className: "Client"
        },
        sendVoice: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendVoice",
            className: "Client"
        },
        sendFile: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendFile",
            className: "Client"
        },
        sendGif: {
            args: [
                "chat_id",
                "fileUri",
                "caption",
                "message_id",
                "options = {events:getEvents(), metadata={...fileData}}"
            ],
            method: "sendGif",
            className: "Client"
        },
        downloadFile: {
            args: ["file_inline", "options = getEvents()"],
            method: "downloadFile",
            className: "Client"
        },
        downloadAvatar: {
            args: ["avatar_inline", "options = getEvents()"],
            method: "downloadAvatar",
            className: "Client"
        },
        sendMessage: {
            args: [
                "chat_id",
                "text",
                "message_id",
                "fileInline = null",
                "options = getEvents()"
            ],
            method: "sendMessage",
            className: "Client"
        },
        editMessage: {
            args: [
                "chat_id",
                "message_id",
                "new_text",
                "options = getEvents()"
            ],
            method: "editMessage",
            className: "Client"
        },
        deleteMessages: {
            args: ["chat_id", "message_ids", "global", "options = getEvents()"],
            method: "deleteMessages",
            className: "Client"
        },
        sendLocation: {
            args: [
                "chat_id",
                "latitude",
                "longitude",
                "message_id",
                "options = getEvents()"
            ],
            method: "sendLocation",
            className: "Client"
        },
        forwardMessages: {
            args: ["from", "to", "message_ids", "options = getEvents()"],
            method: "forwardMessages",
            className: "Client"
        },
        getMessages: {
            args: [
                "object_guid",
                "max_id",
                "filter_type",
                "options = getEvents()"
            ],
            method: "getMessages",
            className: "Client"
        },
        getMessagesInterval: {
            args: [
                "object_guid",
                "middle_message_id",
                "filter_type",
                "options = getEvents()"
            ],
            method: "getMessagesInterval",
            className: "Client"
        },
        getMessagesByID: {
            args: ["object_guid", "message_ids", "options = getEvents()"],
            method: "getMessagesByID",
            className: "Client"
        },
        actionOnMessageReaction: {
            args: [
                "object_guid",
                "message_id",
                "action",
                "reaction_id",
                "options = getEvents()"
            ],
            method: "actionOnMessageReaction",
            className: "Client"
        },
        getUserInfo: {
            args: ["user_guid", "options = getEvents()"],
            method: "getUserInfo",
            className: "Client"
        },
        getBlockedUsers: {
            args: ["start_id", "options = getEvents()"],
            method: "getBlockedUsers",
            className: "Client"
        },
        setBlockUser: {
            args: ["user_guid", "action", "options = getEvents()"],
            method: "setBlockUser",
            className: "Client"
        },
        getAvatars: {
            args: ["object_guid", "options = getEvents()"],
            method: "getAvatars",
            className: "Client"
        },
        getMySessions: {
            args: ["options = getEvents()"],
            method: "getMySessions",
            className: "Client"
        },
        deleteSession: {
            args: ["session_key", "options = getEvents()"],
            method: "deleteSession",
            className: "Client"
        },
        deleteOtherSessions: {
            args: ["options = getEvents()"],
            method: "deleteOtherSessions",
            className: "Client"
        },
        updateProfile: {
            args: ["first_name", "last_name", "bio", "options = getEvents()"],
            method: "updateProfile",
            className: "Client"
        },
        deleteAvatar: {
            args: ["avatar_id", "object_guid", "options = getEvents()"],
            method: "deleteAvatar",
            className: "Client"
        },
        updateUsername: {
            args: ["username", "options = getEvents()"],
            method: "updateUsername",
            className: "Client"
        },
        logout: {
            args: ["options = getEvents()"],
            method: "logout",
            className: "Client"
        },
        updateAvatar: {
            args: ["file_id", "object_guid", "options = getEvents()"],
            method: "updateAvatar",
            className: "Client"
        },
        getChannelInfo: {
            args: ["channel_guid", "options = getEvents()"],
            method: "getChannelInfo",
            className: "Client"
        },
        joinChannelByLink: {
            args: ["link", "options = getEvents()"],
            method: "joinChannelByLink",
            className: "Client"
        },
        joinChannelAction: {
            args: ["channel_guid", "action", "options = getEvents()"],
            method: "joinChannelAction",
            className: "Client"
        },
        channelPreviewByJoinLink: {
            args: ["link", "options = getEvents()"],
            method: "channelPreviewByJoinLink",
            className: "Client"
        },
        getChannelLink: {
            args: ["channel_guid", "options = getEvents()"],
            method: "getChannelLink",
            className: "Client"
        },
        getChannelAllMembers: {
            args: [
                "channel_guid",
                "start_id",
                "search_text",
                "options = getEvents()"
            ],
            method: "getChannelAllMembers",
            className: "Client"
        },
        addChannelMembers: {
            args: ["channel_guid", "member_guids", "options = getEvents()"],
            method: "addChannelMembers",
            className: "Client"
        },
        banChannelMember: {
            args: [
                "channel_guid",
                "member_guid",
                "action",
                "options = getEvents()"
            ],
            method: "banChannelMember",
            className: "Client"
        },
        getBannedChannelMembers: {
            args: [
                "channel_guid",
                "search_text",
                "start_id",
                "options = getEvents()"
            ],
            method: "getBannedChannelMembers",
            className: "Client"
        },
        requestChangeObjectOwner: {
            args: [
                "object_guid",
                "new_owner_user_guid",
                "options = getEvents()"
            ],
            method: "requestChangeObjectOwner",
            className: "Client"
        },
        getPendingObjectOwner: {
            args: ["object_guid", "options = getEvents()"],
            method: "getPendingObjectOwner",
            className: "Client"
        },
        editChannelInfo: {
            args: [
                "channel_guid",
                "title",
                "description",
                "options = getEvents()"
            ],
            method: "editChannelInfo",
            className: "Client"
        },
        setChannelLink: {
            args: ["channel_guid", "options = getEvents()"],
            method: "setChannelLink",
            className: "Client"
        },
        setTypeChannel: {
            args: ["channel_guid", "type", "options = getEvents()"],
            method: "setTypeChannel",
            className: "Client"
        },
        updateChannelUsername: {
            args: ["channel_guid", "username", "options = getEvents()"],
            method: "updateChannelUsername",
            className: "Client"
        },
        checkChannelUsername: {
            args: ["username", "options = getEvents()"],
            method: "checkChannelUsername",
            className: "Client"
        },
        getChannelAdminMembers: {
            args: ["channel_guid", "start_id", "options = getEvents()"],
            method: "getChannelAdminMembers",
            className: "Client"
        },
        setChannelAdmin: {
            args: [
                "channel_guid",
                "member_guid",
                "access_list",
                "action",
                "options = getEvents()"
            ],
            method: "setChannelAdmin",
            className: "Client"
        },
        getChannelAdminAccessList: {
            args: ["channel_guid", "member_guid", "options = getEvents()"],
            method: "getChannelAdminAccessList",
            className: "Client"
        },
        channelSignMessages: {
            args: ["channel_guid", "sign_messages", "options = getEvents()"],
            method: "channelSignMessages",
            className: "Client"
        },
        createChannel: {
            args: [
                "title",
                "description",
                "channel_type",
                "member_guids",
                "options = getEvents()"
            ],
            method: "createChannel",
            className: "Client"
        },
        getGroupInfo: {
            args: ["group_guid", "options = getEvents()"],
            method: "getGroupInfo",
            className: "Client"
        },
        joinGroup: {
            args: ["link", "options = getEvents()"],
            method: "joinGroup",
            className: "Client"
        },
        leaveGroup: {
            args: ["group_guid", "options = getEvents()"],
            method: "leaveGroup",
            className: "Client"
        },
        groupPreviewByJoinLink: {
            args: ["link", "options = getEvents()"],
            method: "groupPreviewByJoinLink",
            className: "Client"
        },
        getCommonGroups: {
            args: ["user_guid", "options = getEvents()"],
            method: "getCommonGroups",
            className: "Client"
        },
        getGroupAllMembers: {
            args: [
                "group_guid",
                "search_text",
                "start_id",
                "options = getEvents()"
            ],
            method: "getGroupAllMembers",
            className: "Client"
        },
        getGroupDefaultAccess: {
            args: ["group_guid", "options = getEvents()"],
            method: "getGroupDefaultAccess",
            className: "Client"
        },
        setGroupDefaultAccess: {
            args: ["group_guid", "access_list", "options = getEvents()"],
            method: "setGroupDefaultAccess",
            className: "Client"
        },
        setGroupTimer: {
            args: ["group_guid", "slow_level", "options = getEvents()"],
            method: "setGroupTimer",
            className: "Client"
        },
        getGroupLink: {
            args: ["group_guid", "options = getEvents()"],
            method: "getGroupLink",
            className: "Client"
        },
        addGroupMembers: {
            args: ["group_guid", "member_guids", "options = getEvents()"],
            method: "addGroupMembers",
            className: "Client"
        },
        banGroupMember: {
            args: [
                "group_guid",
                "member_guid",
                "action",
                "options = getEvents()"
            ],
            method: "banGroupMember",
            className: "Client"
        },
        getBannedGroupMembers: {
            args: [
                "group_guid",
                "search_text",
                "start_id",
                "options = getEvents()"
            ],
            method: "getBannedGroupMembers",
            className: "Client"
        },
        getGroupAdminMembers: {
            args: ["group_guid", "start_id", "options = getEvents()"],
            method: "getGroupAdminMembers",
            className: "Client"
        },
        setGroupAdmin: {
            args: [
                "group_guid",
                "member_guid",
                "access_list",
                "action",
                "options = getEvents()"
            ],
            method: "setGroupAdmin",
            className: "Client"
        },
        getGroupAdminAccessList: {
            args: ["group_guid", "member_guid", "options = getEvents()"],
            method: "getGroupAdminAccessList",
            className: "Client"
        },
        getGroupOnlineCount: {
            args: ["group_guid", "options = getEvents()"],
            method: "getGroupOnlineCount",
            className: "Client"
        },
        showChatHistoryForNewMembers: {
            args: ["group_guid", "account", "options = getEvents()"],
            method: "showChatHistoryForNewMembers",
            className: "Client"
        },
        showGlassMessage: {
            args: ["group_guid", "action", "options = getEvents()"],
            method: "showGlassMessage",
            className: "Client"
        },
        changeGroupLink: {
            args: ["group_guid", "options = getEvents()"],
            method: "changeGroupLink",
            className: "Client"
        },
        editGroupInfo: {
            args: [
                "group_guid",
                "title",
                "description",
                "options = getEvents()"
            ],
            method: "editGroupInfo",
            className: "Client"
        },
        createGroup: {
            args: ["title", "member_guids", "options = getEvents()"],
            method: "createGroup",
            className: "Client"
        },
        deleteGroup: {
            args: ["group_guid", "options = getEvents()"],
            method: "deleteGroup",
            className: "Client"
        },
        getContacts: {
            args: ["start_id", "options = getEvents()"],
            method: "getContacts",
            className: "Client"
        },
        getContactsUpdates: {
            args: ["options = getEvents()"],
            method: "getContactsUpdates",
            className: "Client"
        },
        getContactsLastOnline: {
            args: ["user_guids", "options = getEvents()"],
            method: "getContactsLastOnline",
            className: "Client"
        },
        deleteContact: {
            args: ["user_guid", "options = getEvents()"],
            method: "deleteContact",
            className: "Client"
        },
        changeContactInfo: {
            args: ["first_name", "last_name", "phone", "options = getEvents()"],
            method: "changeContactInfo",
            className: "Client"
        },
        getChats: {
            args: ["start_id", "options = getEvents()"],
            method: "getChats",
            className: "Client"
        },
        deleteUserChat: {
            args: [
                "user_guid",
                "last_deleted_message_id",
                "options = getEvents()"
            ],
            method: "deleteUserChat",
            className: "Client"
        },
        setPinMessage: {
            args: [
                "object_guid",
                "message_id",
                "action",
                "options = getEvents()"
            ],
            method: "setPinMessage",
            className: "Client"
        },
        endChatActivity: {
            args: ["object_guid", "activity", "options = getEvents()"],
            method: "endChatActivity",
            className: "Client"
        },
        deleteChatHistory: {
            args: ["object_guid", "last_message_id", "options = getEvents()"],
            method: "deleteChatHistory",
            className: "Client"
        },
        getLinkFromAppUrl: {
            args: ["uri", "options = getEvents()"],
            method: "getLinkFromAppUrl",
            className: "Client"
        },
        getObjectByUsername: {
            args: ["username", "options = getEvents()"],
            method: "getObjectByUsername",
            className: "Client"
        },
        getMyGif: {
            args: ["options = getEvents()"],
            method: "getMyGif",
            className: "Client"
        },
        addToMyGif: {
            args: ["object_guid", "message_id", "options = getEvents()"],
            method: "addToMyGif",
            className: "Client"
        },
        searchGlobalMessages: {
            args: ["search_text", "start_id", "options = getEvents()"],
            method: "searchGlobalMessages",
            className: "Client"
        },
        searchGlobalObjects: {
            args: ["search_text", "options = getEvents()"],
            method: "searchGlobalObjects",
            className: "Client"
        },
        searchChatMessages: {
            args: ["object_guid", "search_text", "options = getEvents()"],
            method: "searchChatMessages",
            className: "Client"
        },
        checkUserUsername: {
            args: ["username", "options = getEvents()"],
            method: "checkUserUsername",
            className: "Client"
        },
        getAbsObjects: {
            args: ["objects_guids", "options = getEvents()"],
            method: "getAbsObjects",
            className: "Client"
        },
        getAvailableReactions: {
            args: ["options = getEvents()"],
            method: "getAvailableReactions",
            className: "Client"
        },
        getProfileList: {
            args: ["limit = 10", "options = getEvents()"],
            method: "getProfileList",
            className: "Rubino"
        },
        getMyProfileInfo: {
            args: ["profile_id", "options = getEvents()"],
            method: "getMyProfileInfo",
            className: "Rubino"
        },
        getRecentFollowingPosts: {
            args: ["profile_id", "limit = 20", "options = getEvents()"],
            method: "getRecentFollowingPosts",
            className: "Rubino"
        },
        getProfilesStories: {
            args: ["profile_id", "options = getEvents()"],
            method: "getProfilesStories",
            className: "Rubino"
        },
        getMyProfilePosts: {
            args: ["limit = 21", "options = getEvents()"],
            method: "getMyProfilePosts",
            className: "Rubino"
        },
        getStoryIds: {
            args: ["profile_id", "target_profile_id", "options = getEvents()"],
            method: "getStoryIds",
            className: "Rubino"
        },
        getStory: {
            args: [
                "profile_id",
                "story_profile_id",
                "story_ids",
                "options = getEvents()"
            ],
            method: "getStory",
            className: "Rubino"
        },
        addViewStory: {
            args: [
                "profile_id",
                "story_profile_id",
                "story_ids",
                "options = getEvents()"
            ],
            method: "addViewStory",
            className: "Rubino"
        },
        likePostAction: {
            args: [
                "post_id",
                "post_profile_id",
                "action_type",
                "options = getEvents()"
            ],
            method: "likePostAction",
            className: "Rubino"
        },
        postBookmarkAction: {
            args: [
                "post_id",
                "post_profile_id",
                "action_type",
                "options = getEvents()"
            ],
            method: "postBookmarkAction",
            className: "Rubino"
        },
        getComments: {
            args: [
                "profile_id",
                "post_id",
                "post_profile_id",
                "limit = 20",
                "min_id",
                "options = getEvents()"
            ],
            method: "getComments",
            className: "Rubino"
        },
        addComment: {
            args: [
                "profile_id",
                "content",
                "post_id",
                "post_profile_id",
                "options = getEvents()"
            ],
            method: "addComment",
            className: "Rubino"
        },
        likeCommentAction: {
            args: [
                "profile_id",
                "post_id",
                "comment_id",
                "action_type",
                "options = getEvents()"
            ],
            method: "likeCommentAction",
            className: "Rubino"
        },
        addReplyComment: {
            args: [
                "profile_id",
                "content",
                "comment_id",
                "post_id",
                "options = getEvents()"
            ],
            method: "addReplyComment",
            className: "Rubino"
        },
        getCommentReplies: {
            args: [
                "profile_id",
                "post_id",
                "comment_id",
                "max_id",
                "limit = 10",
                "options = getEvents()"
            ],
            method: "getCommentReplies",
            className: "Rubino"
        },
        getShareLink: {
            args: [
                "profile_id",
                "post_id",
                "post_profile_id",
                "options = getEvents()"
            ],
            method: "getShareLink",
            className: "Rubino"
        },
        getProfileInfo: {
            args: ["target_profile_id", "options = getEvents()"],
            method: "getProfileInfo",
            className: "Rubino"
        },
        getProfilePosts: {
            args: [
                "target_profile_id",
                "max_id",
                "limit = 21",
                "options = getEvents()"
            ],
            method: "getProfilePosts",
            className: "Rubino"
        },
        getProfileFollowers: {
            args: [
                "profile_id",
                "target_profile_id",
                "max_id",
                "limit = 20",
                "options = getEvents()"
            ],
            method: "getProfileFollowers",
            className: "Rubino"
        },
        searchFollower: {
            args: [
                "profile_id",
                "target_profile_id",
                "username",
                "limit = 10",
                "options = getEvents()"
            ],
            method: "searchFollower",
            className: "Rubino"
        },
        getProfileFollowing: {
            args: [
                "profile_id",
                "target_profile_id",
                "max_id",
                "limit = 20",
                "options = getEvents()"
            ],
            method: "getProfileFollowing",
            className: "Rubino"
        },
        searchFollowing: {
            args: [
                "profile_id",
                "target_profile_id",
                "username",
                "limit = 10",
                "options = getEvents()"
            ],
            method: "searchFollowing",
            className: "Rubino"
        },
        requestFollow: {
            args: [
                "profile_id",
                "followee_id",
                "follow",
                "options = getEvents()"
            ],
            method: "requestFollow",
            className: "Rubino"
        },
        getPostsByHashTag: {
            args: ["hashtag", "start_id", "options = getEvents()"],
            method: "getPostsByHashTag",
            className: "Rubino"
        },
        isExistUsername: {
            args: ["username", "options = getEvents()"],
            method: "isExistUsername",
            className: "Rubino"
        },
        getExplorePostTopics: {
            args: ["profile_id", "options = getEvents()"],
            method: "getExplorePostTopics",
            className: "Rubino"
        },
        getExplorePosts: {
            args: [
                "profile_id",
                "max_id",
                "limit = 21",
                "options = getEvents()"
            ],
            method: "getExplorePosts",
            className: "Rubino"
        },
        searchProfile: {
            args: [
                "profile_id",
                "username",
                "limit = 20",
                "options = getEvents()"
            ],
            method: "searchProfile",
            className: "Rubino"
        },
        getHashTagTrend: {
            args: ["profile_id", "limit = 20", "options = getEvents()"],
            method: "getHashTagTrend",
            className: "Rubino"
        },
        searchHashTag: {
            args: [
                "profile_id",
                "content",
                "limit = 20",
                "options = getEvents()"
            ],
            method: "searchHashTag",
            className: "Rubino"
        },
        getSuggested: {
            args: [
                "profile_id",
                "max_id",
                "limit = 20",
                "options = getEvents()"
            ],
            method: "getSuggested",
            className: "Rubino"
        },
        getNewEvents: {
            args: ["profile_id", "limit = 20", "options = getEvents()"],
            method: "getNewEvents",
            className: "Rubino"
        },
        sendCode: {
            args: ["phone", "pass_key", "options = getEvents()"],
            method: "sendCode",
            className: "Login"
        },
        signIn: {
            args: ["phone", "code", "phone_code_hash", "options = getEvents()"],
            method: "signIn",
            className: "Login"
        }
    };
    let methodName = method
        .toString()
        .split("(")[0]
        .split("function ")
        .join("");
    return methodsInfo[methodName];
};
export default getMethodInfo;
