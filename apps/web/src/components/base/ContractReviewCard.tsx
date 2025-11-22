import { JSX } from "react";
import { useState } from "react";

interface ContractReviewCardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    rating: number;
    liked: string;
    disliked: string;
  }) => void;
}

export default  function ContractReviewCard({ open, onClose, onSubmit = () => {} }: ContractReviewCardProps) {
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState("");
  const [disliked, setDisliked] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-darkBase border border-dark p-4 rounded-md w-[360px] text-light shadow-xl">
        <h2 className="text-lg font-medium mb-2 text-light">
          Quick Feedback
        </h2>
        <p className="text-sm text-light/70 mb-4">
          How was your contract generation experience?
        </p>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`w-8 h-8 flex items-center justify-center rounded-sm transition
                ${rating >= star ? "bg-primary text-light" : "bg-dark text-light/40"}
              `}
            >
              {star}
            </button>
          ))}
        </div>

        {/* Liked */}
        <label className="text-sm text-light/70 mb-1 block">
          What did you like?
        </label>
        <textarea
          value={liked}
          onChange={(e) => setLiked(e.target.value)}
          className="w-full bg-dark text-light/80 border border-dark rounded-sm p-2 text-sm mb-3 resize-none h-16 focus:outline-none focus:border-primary"
        />

        {/* Disliked */}
        <label className="text-sm text-light/70 mb-1 block">
          What could be improved?
        </label>
        <textarea
          value={disliked}
          onChange={(e) => setDisliked(e.target.value)}
          className="w-full bg-dark text-light/80 border border-dark rounded-sm p-2 text-sm mb-4 resize-none h-16 focus:outline-none focus:border-primary"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-dark text-light/60 border border-dark rounded-sm hover:bg-dark/80 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSubmit({ rating, liked, disliked });
              onClose();
            }}
            className="px-4 py-1.5 bg-primary text-light rounded-sm hover:bg-primaryLight transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
