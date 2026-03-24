import { useAuth } from "../context/AuthContext";

const CommentBox = ({ comment }) => {
  const { user } = useAuth();
  const ismine = comment.user_id === user?.id;

  return (
    <div
      className={`comment-bubble ${ismine ? "comment-mine" : "comment-other"}`}
    >
      <div className="comment-header">
        <span className="comment-author">{comment.author_name}</span>
        <span className={`role-badge role-${comment.author_role}`}>
          {comment.author_role}
        </span>
        <span className="comment-time">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p>{comment.message}</p>
    </div>
  );
};

export default CommentBox;
