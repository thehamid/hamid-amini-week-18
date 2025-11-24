export default function StarCheckbox({ isFavOnly, onFavOnly, favoritesExist }) {
  return (
    <label
      style={{
        cursor: favoritesExist ? 'pointer' : 'not-allowed',
        fontSize: '24px',
        color: isFavOnly ? '#ffbb00' : '#c2c2c2ff',
        userSelect: 'none',
        textAlign:'center'
      }}
    >
      <input
        type="checkbox"
        checked={isFavOnly}
        onChange={onFavOnly}
        disabled={!favoritesExist}
        style={{ display: 'none' }}
      />
      {isFavOnly ? '★' : '☆'}
    </label>
  );
}