export default function DetailSummaryBtns({renderSummaryTable, renderTable, details, toggleDetails}){
    return(
        <div>
            <button onClick={renderSummaryTable}>{renderTable ? 'Hide ' : 'Show '}Summary</button>
            <button onClick={toggleDetails}>{details ? 'Hide ' : 'Show '} Details</button>
        </div>
    )
}