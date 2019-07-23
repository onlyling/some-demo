import React from 'react';

import './todo.scss';

export default () => {
  return (
    <React.Fragment>
      <div className="test-boxx">
        <div className="test-box">
          <div className="s-header" />
          <div className="s-footer" />
          <div className="ctx">232</div>
        </div>
        <div className="test-box">
          <div className="s-header" />
          <div className="s-footer" />
          <div className="ctx">232</div>
        </div>
      </div>

      <div className="test-boxx">
        <div className="test-box2">
          <div className="s-header" />
          <div className="s-footer" />
          <div className="ctx">232</div>
        </div>
        <div className="test-box2">
          <div className="s-header" />
          <div className="s-footer" />
          <div className="ctx">232</div>
        </div>
      </div>
    </React.Fragment>
  );
};
