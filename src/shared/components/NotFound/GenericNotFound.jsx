import notfoundImg from '../../../assets/images/cards/newntfnd.png'

function GenericNotFound({ title, description }) {
  return (
    <div className="flex-col flex gap-3 items-center py-2">
      <h1 className="text-2xl font-bold text-center opacity-60"> {title} </h1>
      <h3 className="text-xl text-center opacity-40"> {description}</h3>

      <img src={notfoundImg} alt="Bulunamadı" style={{ borderRadius: '15px' }} />
    </div>
  )
}

export default GenericNotFound
