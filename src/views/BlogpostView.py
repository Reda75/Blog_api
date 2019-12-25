from flask import Blueprint, request, Response, json, g

from src.models.BlogPostModel import BlogPostSchema, BlogPostModel
from src.shared.Authentication import Auth

blogPost_api = Blueprint('posts', __name__)

blogPost_schema = BlogPostSchema()


@blogPost_api.route('/', methods=['POST'])
@Auth.auth_required
def create():
    """
    Create poste function
    """
    req_data = request.get_json()
    req_data['owner_id'] = g.user.get('id')
    print(req_data)
    data = blogPost_schema.load(req_data)
    print(req_data)

    post = BlogPostModel(data)
    print(post)
    post.save()

    data = blogPost_schema.dump(post)

    return custom_response(data, 201)


@blogPost_api.route('/', methods=['GET'])
def get_all():
    """
    Get all posts function
    """
    posts = BlogPostModel.get_all_blogposts()

    if not posts:
        return custom_response({'message': 'posts list is empty'}, 200)

    data = blogPost_schema.dump(posts, many=True)

    return custom_response(data, 200)


@blogPost_api.route('/<int:blogpost_id>', methods=['GET'])
def get_one(blogpost_id):
    """
    Get one post function
    """
    post = BlogPostModel.get_one_blogpost(blogpost_id)

    if not post:
        return custom_response({'error': 'post not found'}, 400)

    data = blogPost_schema.dump(post)

    return custom_response(data, 200)


@blogPost_api.route('/<blogpost_id>', methods=['PUT'])
@Auth.auth_required
def update(blogpost_id):
    """
    update user's post function
    """
    req_data = request.get_json()
    post = BlogPostModel.get_one_blogpost(blogpost_id)

    # check if post exist
    if not post:
        return custom_response({'error': 'post not found'}, 400)

    data = blogPost_schema.dump(post)

    # check if connected user & post's owner_id are equals
    if data.get('owner_id') != g.user.get('id'):
        return custom_response({'error': 'permission denied'}, 400)

    data = blogPost_schema.load(req_data, partial=True)
    post.update(data)

    data = blogPost_schema.dump(post)

    return custom_response(data, 200)


@blogPost_api.route('/<int:blogpost_id>', methods=['DELETE'])
@Auth.auth_required
def delete(blogpost_id):
    """
    Delete user's post function
    """
    post = BlogPostModel.get_one_blogpost(blogpost_id)

    if not post:
        return custom_response({'error': 'post not exist'}, 400)

    data = blogPost_schema.dump(post)

    if data.get('owner_id') != g.user.get('id'):
        return custom_response({'error': 'permission denied'}, 400)

    post.delete()
    return custom_response({'message': 'post deleted'}, 200)


def custom_response(res, status_code):
    """
    Custom Response Function
    """
    return Response(
        mimetype="application/json",
        response=json.dumps(res),
        status=status_code
    )
