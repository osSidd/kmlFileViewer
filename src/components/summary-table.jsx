export default function SummaryTable({summary}){

    return(
        <table>
        <thead>
          <tr>
            <th>Element Type</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(summary).map(([type, count]) => (
            <tr key={type}>
              <td style={{textAlign:'left'}}>{type}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>

    )
}