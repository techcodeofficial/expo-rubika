import { getClient } from "../helpers";
import { rubinoRequest } from "../utils";
import { getNowTime, getEvents } from "../tools";
class Rubino {
    constructor(auth, platform = "pwa") {
        this.auth = auth;
        this.platform = platform.toLowerCase().includes("pwa")
            ? "pwa"
            : "android";
    }
    async handler(method, data, options) {
        let isCanceled = false;
        function cancelRequest() {
            isCanceled = true;
        }
        let mainData = {
            auth: this.auth,
            api_version: 0,
            client: getClient(this.platform),
            data,
            method
        };
        let result;
        if (options.onStartRequest) {
            options.onStartRequest({
                requestTime: getNowTime(),
                methodType: method,
                methodData: data,
                cancelRequest
            });
        }
        while (true) {
            if (isCanceled) {
                if (options.onCancelRequest) {
                    options.onCancelRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                return { status: "CANCEL REQUEST" };
                break;
            }
            try {
                result = await rubinoRequest(mainData);
                if (options.onSendRequest) {
                    options.onSendRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data
                    });
                }
                break;
            } catch (e) {
                if (options.onErrorRequest) {
                    options.onErrorRequest({
                        requestTime: getNowTime(),
                        methodType: method,
                        methodData: data,
                        cancelRequest
                    });
                }
                continue;
            }
        }
        let response = result.data;
        return response;
    }
    async getProfileList(limit = 10, options = getEvents()) {
        return await this.handler(
            "getProfileList",
            {
                limit,
                sort: "FromMax"
            },
            options
        );
    }
    async getMyProfileInfo(profile_id, options = getEvents()) {
        return await this.handler(
            "getProfileList",
            {
                profile_id
            },
            options
        );
    }
    async getRecentFollowingPosts(
        profile_id,
        limit = 20,
        options = getEvents()
    ) {
        return await this.handler(
            "getRecentFollowingPosts",
            {
                profile_id,
                limit
            },
            options
        );
    }
    async getProfilesStories(profile_id, options = getEvents()) {
        return await this.handler(
            "getProfilesStories",
            {
                profile_id
            },
            options
        );
    }
    async getMyProfilePosts(limit = 21, options = getEvents()) {
        return await this.handler(
            "getMyProfilePosts",
            {
                limit,
                sort: "FromMax"
            },
            options
        );
    }
    async getStoryIds(profile_id, target_profile_id, options = getEvents()) {
        return await this.handler(
            "getStoryIds",
            {
                profile_id,
                target_profile_id
            },
            options
        );
    }
    async getStory(
        profile_id,
        story_profile_id,
        story_ids,
        options = getEvents()
    ) {
        return await this.handler(
            "getStory",
            {
                profile_id,
                story_profile_id,
                story_ids
            },
            options
        );
    }
    async addViewStory(
        profile_id,
        story_profile_id,
        story_ids,
        options = getEvents()
    ) {
        return await this.handler(
            "addViewStory",
            {
                profile_id,
                story_profile_id,
                story_ids
            },
            options
        );
    }
    async likePostAction(
        post_id,
        post_profile_id,
        action_type,
        options = getEvents()
    ) {
        action_type = action_type ? "Like" : "Unlike";
        return await this.handler(
            "likePostAction",
            {
                post_id,
                post_profile_id,
                action_type
            },
            options
        );
    }
    async postBookmarkAction(
        post_id,
        post_profile_id,
        action_type,
        options = getEvents()
    ) {
        action_type = action_type ? "Bookmark" : "Unbookmark";
        return await this.handler(
            "postBookmarkAction",
            {
                post_id,
                post_profile_id,
                action_type
            },
            options
        );
    }
    async getComments(
        profile_id,
        post_id,
        post_profile_id,
        limit = 20,
        min_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getComments",
            {
                profile_id,
                post_id,
                post_profile_id,
                limit,
                sort: "FromMin",
                min_id
            },
            options
        );
    }
    async addComment(
        profile_id,
        content,
        post_id,
        post_profile_id,
        options = getEvents()
    ) {
        return await this.handler(
            "addComment",
            {
                content,
                post_id,
                post_profile_id,
                profile_id
            },
            options
        );
    }
    async likeCommentAction(
        profile_id,
        post_id,
        comment_id,
        action_type,
        options = getEvents()
    ) {
        action_type = action_type ? "Like" : "Unlike";
        return await this.handler(
            "likeCommentAction",
            {
                profile_id,
                post_id,
                comment_id,
                action_type
            },
            options
        );
    }
    async addReplyComment(
        profile_id,
        content,
        comment_id,
        post_id,
        options = getEvents()
    ) {
        return await this.handler(
            "addReplyComment",
            {
                profile_id,
                content,
                comment_id,
                post_id
            },
            options
        );
    }
    async getCommentReplies(
        profile_id,
        post_id,
        comment_id,
        max_id,
        limit = 10,
        options = getEvents()
    ) {
        return await this.handler(
            "getCommentReplies",
            {
                sort: "FromMin",
                profile_id,
                post_id,
                comment_id,
                max_id
            },
            options
        );
    }
    async getShareLink(
        profile_id,
        post_id,
        post_profile_id,
        options = getEvents()
    ) {
        return await this.handler(
            "getShareLink",
            {
                profile_id,
                post_id,
                post_profile_id
            },
            options
        );
    }
    async getProfileInfo(target_profile_id, options = getEvents()) {
        return await this.handler(
            "getProfileInfo",
            {
                target_profile_id
            },
            options
        );
    }
    async getProfilePosts(
        target_profile_id,
        max_id,
        limit = 21,
        options = getEvents()
    ) {
        return await this.handler(
            "getProfilePosts",
            {
                target_profile_id,
                max_id,
                limit,
                sort: "FromMax"
            },
            options
        );
    }
    async getProfileFollowers(
        profile_id,
        target_profile_id,
        max_id,
        limit = 20,
        options = getEvents()
    ) {
        return await this.handler(
            "getProfileFollowers",
            {
                profile_id,
                target_profile_id,
                limit,
                sort: "FromMax",
                f_type: "Follower",
                max_id
            },
            options
        );
    }
    async searchFollower(
        profile_id,
        target_profile_id,
        username,
        limit = 10,
        options = getEvents()
    ) {
        return await this.handler(
            "searchFollower",
            {
                profile_id,
                target_profile_id,
                username,
                limit,
                search_type: "Follower"
            },
            options
        );
    }
    async getProfileFollowing(
        profile_id,
        target_profile_id,
        max_id,
        limit = 20,
        options = getEvents()
    ) {
        return await this.handler(
            "getProfileFollowers",
            {
                f_type: "Following",
                sort: "FromMax",
                profile_id,
                target_profile_id,
                max_id,
                limit
            },
            options
        );
    }
    async searchFollowing(
        profile_id,
        target_profile_id,
        username,
        limit = 10,
        options = getEvents()
    ) {
        return await this.handler(
            "searchFollower",
            {
                profile_id,
                target_profile_id,
                username,
                limit,
                search_type: "Following"
            },
            options
        );
    }
    async requestFollow(
        profile_id,
        followee_id,
        follow,
        options = getEvents()
    ) {
        follow = follow ? "Follow" : "Unfollow";
        return await this.handler(
            "requestFollow",
            {
                profile_id,
                followee_id,
                f_type: follow
            },
            options
        );
    }
    async getPostsByHashTag(hashtag, start_id, options = getEvents()) {
        return await this.handler(
            "getPostsByHashTag",
            {
                hashtag,
                start_id
            },
            options
        );
    }
    async isExistUsername(username, options = getEvents()) {
        return await this.handler(
            "isExistUsername",
            {
                username
            },
            options
        );
    }
    async getExplorePostTopics(profile_id, options = getEvents()) {
        return await this.handler(
            "getExplorePostTopics",
            { profile_id },
            options
        );
    }
    async getExplorePosts(
        profile_id,
        max_id,
        limit = 21,
        options = getEvents()
    ) {
        return await this.handler(
            "getExplorePosts",
            {
                profile_id,
                max_id,
                limit,
                sort: "FromMax"
            },
            options
        );
    }
    async searchProfile(
        profile_id,
        username,
        limit = 20,
        options = getEvents()
    ) {
        return await this.handler(
            "searchProfile",
            {
                username,
                profile_id,
                limit
            },
            options
        );
    }
    async getHashTagTrend(profile_id, limit = 20, options = getEvents()) {
        return await this.handler(
            "getHashTagTrend",
            {
                profile_id,
                limit
            },
            options
        );
    }
    async searchHashTag(
        profile_id,
        content,
        limit = 20,
        options = getEvents()
    ) {
        return await this.handler(
            "searchHashTag",
            {
                limit,
                profile_id,
                content
            },
            options
        );
    }
    async getSuggested(profile_id, max_id, limit = 20, options = getEvents()) {
        return await this.handler(
            "getSuggested",
            {
                sort: "FromMax",
                profile_id,
                max_id,
                limit
            },
            options
        );
    }
    async getNewEvents(profile_id, limit = 20, options = getEvents()) {
        return await this.handler(
            "getNewEvents",
            {
                profile_id,
                limit,
                sort: "FromMax"
            },
            options
        );
    }
}
export default Rubino;
