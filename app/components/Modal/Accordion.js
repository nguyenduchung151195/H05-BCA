import React, {useState, useEffect} from 'react';
const Accordion = ({ title, content, openAccordion, order }) => {
    return (
        <div className="accordion-item">
            {openAccordion.order === order && openAccordion.status&& 
            <div 
            className="accordion-content" 
            style={{ display: 'flex', justifyContent: "center", alignItems: 'center', border: "1px solid #757575", borderRadius: "5px", padding: "30px 20px", marginBottom: 20}}>
                {content}
            </div>}
        </div>
    );
};

export default Accordion;