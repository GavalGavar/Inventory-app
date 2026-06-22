const fs = require('fs');
let c = fs.readFileSync('src/app/page.js', 'utf8');

const oldCard = `            <div
              key={item.id}
              className="rounded p-3 relative"
              style={{
                background: 'var(--card)',
                border: '0.5px solid var(--border)',
                opacity: item.quantity > 0 ? 1 : 0.6,
              }}
            >
              <span
                className="absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded"
                style={{
                  background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                  color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)',
                  transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)',
                }}
              >
                {item.quantity > 0 ? 'Бэлэн бараа' : 'Дууссан'}
              </span>

              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
              )}

              <h2 className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {item.name}
              </h2>
              <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>
                {item.quantity} Үлдэгдэл
              </p>

              <div className="flex justify-between items-center">
                <span
                  className="text-base font-medium"
                  style={{ color: item.quantity > 0 ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {item.price.toLocaleString()} MNT
                </span>

                {item.quantity > 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="text-xs px-3 py-1 rounded"
                    style={{ border: '0.5px solid var(--border)', color: 'var(--muted)' }}
                  >
                    Сагсанд нэмэх
                  </button>
                ) : (
                  <span className="text-xs px-3 py-1" style={{ color: 'var(--muted)' }}>
                    â€"
                  </span>
                )}
              </div>
            </div>`;

const newCard = `            <div
              key={item.id}
              className="rounded p-2 relative"
              style={{
                background: 'var(--card)',
                border: '0.5px solid var(--border)',
                opacity: item.quantity > 0 ? 1 : 0.6,
              }}
            >
              <span
                className="absolute top-2 right-2 text-sm font-medium px-2 py-1 rounded"
                style={{
                  background: item.quantity > 0 ? 'var(--stock-bg)' : 'var(--soldout-bg)',
                  color: item.quantity > 0 ? 'var(--stock-text)' : 'var(--soldout-text)',
                  transform: item.quantity > 0 ? 'none' : 'rotate(-4deg)',
                }}
              >
                {item.quantity > 0 ? 'Бэлэн бараа' : 'Дууссан'}
              </span>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full aspect-square object-cover rounded mb-2"
                />
              )}
              <h2 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                {item.name}
              </h2>
              <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                {item.price.toLocaleString()} MNT · {item.quantity} Үлдэгдэл
              </p>
              <div className="flex justify-between items-center">
                {item.quantity > 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="text-sm font-medium px-3 py-1 rounded"
                    style={{ border: '0.5px solid var(--border)', color: 'var(--accent)' }}
                  >
                    Сагсанд нэмэх
                  </button>
                ) : (
                  <span className="text-sm px-3 py-1" style={{ color: 'var(--muted)' }}>—</span>
                )}
              </div>
            </div>`;

c = c.replace(oldCard, newCard);
fs.writeFileSync('src/app/page.js', c, 'utf8');
console.log('Done!');
