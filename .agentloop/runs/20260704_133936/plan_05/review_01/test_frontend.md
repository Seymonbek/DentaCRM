# test-frontend

returncode: 0
seconds: 3.27
timed_out: False

## Command
```text
bash -lc npm run test -- --run
```

## STDOUT
```text

> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 9ms
 ✓ src/store/stores.test.ts  (8 tests) 15ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 81ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 120ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 148ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 403ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 194ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 356ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 242ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  04:02:00
   Duration  2.86s (transform 770ms, setup 3.08s, collect 2.66s, tests 1.57s, environment 7.37s, prepare 3.00s)


```

## STDERR
```text

```