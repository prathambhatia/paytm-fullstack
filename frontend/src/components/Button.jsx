export const Button = ({title, onClick, bgColor, textColor}) => {

    return (
        <button 
            onClick = {onClick}
            className ={`${bgColor} ${textColor} py-2 mb-2 w-full rounded font-bold cursor-pointer`}>
            {title}
        </button>
        
    )
}