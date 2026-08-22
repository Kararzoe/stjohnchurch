import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://bworzpdoqinverdtbooq.supabase.co',
  'sb_publishable_iydqBWj7YvaHtM-CI4zDJg_7NY0Ieln'
)

const { data: rows, error: fetchError } = await supabase
  .from('votes')
  .select('id, created_at, voter_name, contestant_name')
  .eq('status', 'pending')
  .gte('created_at', '2025-08-09T00:00:00.000Z')
  .lte('created_at', '2025-08-20T23:59:59.999Z')

if (fetchError) { console.error('Fetch error:', fetchError.message); process.exit(1) }
if (!rows?.length) { console.log('No pending votes found in Aug 9–20.'); process.exit(0) }

console.log(`Found ${rows.length} pending votes. Approving...`)

const ids = rows.map(r => r.id)
const { error: updateError } = await supabase.from('votes').update({ status: 'approved' }).in('id', ids)
if (updateError) { console.error('Update error:', updateError.message); process.exit(1) }

console.log(`✅ Successfully approved ${ids.length} votes from Aug 9–20.`)
