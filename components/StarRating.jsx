import React from 'react';

const StarRating = ({ onRatingSelect, className }) => {
    const starValues = [];
    for (let i = 1; i <= 5; i += 1) {
        starValues.push(i);
    }

    return (
        <div className={`star-rating flex ${className} py-2`}>
            <input className="hidden" id="star5" type="radio" name="rating" value="5" onChange={onRatingSelect} />
            <label className="star cursor-pointer" htmlFor="star5">&#9733;</label>

            <input className="hidden" id="star4" type="radio" name="rating" value="4" onChange={onRatingSelect} />
            <label className="star cursor-pointer" htmlFor="star4">&#9733;</label>

            <input className="hidden" id="star3" type="radio" name="rating" value="3" onChange={onRatingSelect} />
            <label className="star cursor-pointer" htmlFor="star3">&#9733;</label>

            <input className="hidden" id="star2" type="radio" name="rating" value="2" onChange={onRatingSelect} />
            <label className="star cursor-pointer" htmlFor="star2">&#9733;</label>

            <input className="hidden" id="star1" type="radio" name="rating" value="1" onChange={onRatingSelect} />
            <label className="star cursor-pointer" htmlFor="star1">&#9733;</label>
        </div>
    );
};

export default StarRating;
